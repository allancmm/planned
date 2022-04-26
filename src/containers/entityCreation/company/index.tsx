import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import { InputText, Options } from "../../../components/general";
import produce, {immerable} from 'immer';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import { defaultCompanyService, defaultEntitiesService, defaultEntityInformationService } from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import Company from '../../../lib/domain/entities/company';
import CreateCompanyRequest from '../../../lib/domain/entities/createCompanyRequest';
import Currency from '../../../lib/domain/entities/currency';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import CompanyService from '../../../lib/services/companyService';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import FrameworkComponent from "../frameworkComponent";
import {validateRequiredFields} from "../util";

const CALENDAR_CODES = 'AsCodeCalendar';

const COMPANY_TYPE = ['Primary', 'Subsidiary'] as const;

type TypeFieldString = 'companyName' | 'defaultCurrencyCode' | 'marketMakerGUID' | 'calendarCode';

class ErrorCompany {
    [immerable] = true;
    companyName = '';
    calendarCode = '';
}

interface CompanyCreationProps {
    companyService: CompanyService;
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const CompanyCreationWizard = ({ companyService, entityInformationService, entityService }: CompanyCreationProps) => {

    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreateCompanyRequest>(new CreateCompanyRequest());
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [marketMakers, setMarketMakers] = useState<BasicEntity[]>([]);
    const [calendarCodes, setCalendarCodes] = useState<BasicEntity[]>([]);
    const [primaryCompanies, setPrimaryCompanies] = useState<Company[]>([]);
    const [renderSubSection, setRenderSubOptions] = useState<boolean>();
    const [companyType, setCompanyType] = useState('');
    const [error, setError] = useState(new ErrorCompany());

    const optionsCurrencyCode = useMemo(() => [
        { label: currencies.length > 0 ? 'Select One' : ' No Currency Code Available', value: ''},
        ...currencies.map((c) => ({
            label: c.currencyCode,
            value: c.currencyCode,
        }))
    ], [currencies]);

    const optionsMarketMaker = useMemo(() => [
        { label: marketMakers.length > 0 ? 'Select One' : ' No Market Maker Available', value: '' },
        ...marketMakers.map((m) => ({
            label: m.name,
            value: m.value,
        }))
    ], [marketMakers]);

    const optionsCalendarCode = useMemo(() => [
        { label: calendarCodes.length > 0 ? 'Select One' : ' No Calendar Code Available', value: ''},
        ...calendarCodes.map((cc) => ({
            label: cc.name,
            value: cc.value,
        }))
    ], [calendarCodes]);

    const optionsPrimaryCode = useMemo(() => [
        { label: primaryCompanies.length > 0 ? 'Select One' : ' No Primary Company Available', value: ''},
        ...primaryCompanies.map((pc) => ({
            label: pc.companyName,
            value: pc.companyGuid,
        }))
    ], [primaryCompanies]);

    const fetchData = load(async () => {
        entityInformationService.getEntityInformation(
            'CURRENCY',
            Currency.guid,
            'CURRENCY').then((entityInfo: EntityInformation) => {
            setCurrencies(entityInfo.currencies);
        });
        entityService.getMarketMaker().then(setMarketMakers);
        entityService.getCodes(CALENDAR_CODES).then(setCalendarCodes);
        companyService.getPrimaryCompanies().then(setPrimaryCompanies);
    });

    useEffect(() => {
        fetchData();
    }, []);

    const renderCompanyType = () => {
        return (
            <InputText
                type='custom-select'
                value={companyType}
                label="Company Type"
                options={[
                    { value: '', label: COMPANY_TYPE.length > 0 ? 'Select One' : ' No Company Type Code Available' },
                    { value: COMPANY_TYPE[0], label: COMPANY_TYPE[0] },
                    { value: COMPANY_TYPE[1], label: COMPANY_TYPE[1] },
                ]}
                onChange={(o : Options) => handleCompanyType(o.value)}
            />
        );
    };

    const renderCompanyName = () => {
        return (
            <InputText
                type='text'
                label="Company Name"
                value={request.companyName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChange('companyName', e.target.value)}
                required
                feedbackMsg={error.companyName}
            />
        );
    };

    const renderDefaultCurrencyCode = () => {
        return (
            <InputText
                type='custom-select'
                value={request.defaultCurrencyCode}
                label="Default Currency Code"
                disabled={currencies.length === 0}
                options={optionsCurrencyCode}
                onChange={(o: Options) => handleFieldChange('defaultCurrencyCode', o.value)}
            />
        );
    };

    const renderMarketMaker = () => {
        return (
            <InputText
                type='custom-select'
                value={request.marketMakerGUID}
                label="Market Maker"
                disabled={marketMakers.length === 0}
                options={optionsMarketMaker}
                onChange={(o: Options) => handleFieldChange('marketMakerGUID', o.value)}
            />
        );
    };

    const renderCalendarCode = () => {
        return (
            <InputText
                type='custom-select'
                value={request.calendarCode}
                label="Calendar Code"
                disabled={calendarCodes.length === 0}
                options={optionsCalendarCode}
                onChange={(o: Options) => handleFieldChange('calendarCode', o.value)}
                required
                feedbackMsg={error.calendarCode}
            />
        );
    };

    const renderEffectiveDate = () => {
        return (
            <InputText
                type='date'
                label="Effective From"
                startDate={request.effectiveDate}
                value={request.effectiveDate}
                onChange={handleEffectiveDate}
            />
        );
    };

    const renderPrimaryCompany = () => {
        return (
            <InputText
                type='custom-select'
                value={request.primaryCompanyGUID}
                label="Primary Company"
                disabled={primaryCompanies.length === 0}
                options={optionsPrimaryCode}
                onChange={(o: Options) => handlePrimaryCompany(o.value)}
                required
            />
        );
    };

    const handleCompanyType = async (val: string) => {
        setCompanyType(val);
        if (val[0] === `S`) {
            setRenderSubOptions(true);
        } else {
            setRenderSubOptions(false);
        }
    };

    const handleFieldChange = (field: TypeFieldString, value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        if(field === 'companyName' || field === 'calendarCode') {
            setError(produce(error, (draft => {
                draft[field] = '';
            })));
        }
    };

    const handleEffectiveDate = (value: Date) => {
        setRequest(
            produce(request, (draft) => {
                draft.effectiveDate = value;
            }),
        );
    };

    const handlePrimaryCompany = (value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.primaryCompanyGUID = value;
            }),
        );
    };

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setError(newError);
        return isValid;
    }

    const createCompany = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        const company = await entityService.createCompany(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            company.entityType,
            company.getGuid(),
            'DATA',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        closeRightbar();
    });

    return (
       <FrameworkComponent
            title='Create Company'
            loading={loading}
            onSubmit={createCompany}
            onCancel={closeRightbar}
        >
            <CollapseContainer title='General' defaultOpened>
                <PanelSectionContainer>
                    <>{renderCompanyType()}</>
                    <>{renderSubSection && renderPrimaryCompany()}</>
                    <>{renderCompanyName()}</>
                    <>{renderDefaultCurrencyCode()}</>
                    <>{renderMarketMaker()}</>
                    <>{renderCalendarCode()}</>
                    <>{renderEffectiveDate()}</>
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

CompanyCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    companyService: defaultCompanyService,
    entityInformationService: defaultEntityInformationService,
};

export default CompanyCreationWizard;
