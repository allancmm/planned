import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import { InputText, Options } from "../../../components/general";
import produce, {immerable} from 'immer';
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultCompanyService, defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import CreateFundRequest from '../../../lib/domain/entities/createFundRequest';
import Currency from '../../../lib/domain/entities/currency';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import CompanyService from '../../../lib/services/companyService';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import {OverrideEnumType} from '../../general/components/overrideEnum';
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

const TYPE_CODE = "AsCodeFundType";
const CALENDAR_CODE = "AsCodeCalendar";
const fieldsFund = ['fundName', 'typeCode', 'currencyCode', 'calendarCode'] as const;
type Fields_Fund = (typeof fieldsFund)[number];


interface FundCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
    companyService: CompanyService;
}
const FundCreationWizard = ({
    entityService,
    entityInformationService,
}: FundCreationProps) => {
    const [request, setRequest] = useState<CreateFundRequest>(new CreateFundRequest());
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const [typeCodes, setTypeCodes] = useState<BasicEntity[]>([]);
    const [currencyCodes, setCurrencyCodes] = useState<Currency[]>([]);
    const [calendarCodes, setCalendarCodes] = useState<BasicEntity[]>([]);

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [errorValidation, setErrorValidation] = useState<ErrorValidation>(new ErrorValidation());

    const optionsTypeCode = useMemo(() =>
        [{ label: typeCodes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: ''},
            ...Object.values(typeCodes).map((f) => ({
                label: f.name,
                value: f.value,
            }))], [typeCodes]);

    const optionsCurrencyCode = useMemo(() => [
        { label: currencyCodes.length > 0 ? 'Select Currency Code' : ' No Currency Code Available', value: ''},
        ...Object.values(currencyCodes).map((f) => ({
            label: f.currencyCode,
            value: f.currencyCode,
        }))
    ], [currencyCodes]);

    const optionsCalendarCode = useMemo(() => [
        { label: calendarCodes.length > 0 ? 'Select Calendar Code' : ' No Calendar Code Available', value: ''},
        ...Object.values(calendarCodes).map((f) => ({
            label: f.name,
            value: f.value,
        }))
    ], [calendarCodes]);

    const fetchData = async () => {
        setTypeCodes(await load(entityService.getCodes)(TYPE_CODE));
        const entityInfo: EntityInformation = await entityInformationService.getEntityInformation(
            'CURRENCY',
            Currency.guid,
            'CURRENCY',
        );
        setCurrencyCodes(entityInfo.currencies);
        setCalendarCodes(await load(entityService.getCodes)(CALENDAR_CODE));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const validateForm = () => {
        let isValid = true;
        const newError = new ErrorValidation();

        if(!request.fundName) {
            newError.fundName = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        setShowMessageOverride(!isOverrideValid);
        setErrorValidation(newError);
        return isValid && isOverrideValid;
    }
    const createFund = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const fund = await load(entityService.createFund)(request);

            const entityInformation = await load(entityInformationService.getEntityInformation)(
                fund.entityType,
                fund.getGuid(),
                'DATA',
            );

            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    };

    const handleFieldChanged = (field: Fields_Fund, value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        field === 'fundName' && setErrorValidation(produce(errorValidation, (draft => { draft[field] = ''; } )));
    }

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                parentType="FUND"
                filteredOverrides={[
                    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
                ]}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    return (
        <FrameworkComponent
            title='Create Fund'
            loading={loading}
            onSubmit={createFund}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        value={request.fundName}
                        feedbackMsg={errorValidation.fundName}
                        label="Fund Name:"
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('fundName', e.target.value)}
                    />

                    <InputText
                        type='custom-select'
                        label="Type Code"
                        value={request.typeCode}
                        options={optionsTypeCode}
                        onChange={(o: Options) => handleFieldChanged('typeCode', o.value)}
                    />

                    <InputText
                        type='custom-select'
                        value={request.currencyCode}
                        label="Currency Code"
                        options={optionsCurrencyCode}
                        onChange={(o: Options) => handleFieldChanged('currencyCode', o.value)}
                    />

                    <InputText
                        type='custom-select'
                        label="Calendar Code"
                        value={request.calendarCode}
                        options={optionsCalendarCode}
                        onChange={(o: Options) => handleFieldChanged('calendarCode', o.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>

            <CollapseContainer title={'Parent Entity'} defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};
FundCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
    companyService: defaultCompanyService,
};
export default FundCreationWizard;

class ErrorValidation {
    [immerable] = true;
    fundName = '';
}