import { CollapseContainer, Loading, useLoading } from 'equisoft-design-ui-elements';
import {immerable, produce} from 'immer';
import React, {FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { InputText, Options } from "../../../components/general";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import { defaultBasicEntityService, defaultCompanyService, defaultEntitiesService, defaultEntityInformationService } from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import Company from '../../../lib/domain/entities/company';
import CreatePlanFundRequest from '../../../lib/domain/entities/createPlanFundRequest';
import BasicEntityService from '../../../lib/services/basicEntityService';
import CompanyService from '../../../lib/services/companyService';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

const depositLevelTrackingValues = ['Y', 'N'];

interface PlanFundCreationProps {
    companyService: CompanyService;
    entityService: EntityService;
    basicEntityService: BasicEntityService;
    entityInformationService: EntityInformationService;
}

const PlanFundCreationWizard = ({ companyService, entityService, basicEntityService, entityInformationService }: PlanFundCreationProps) => {
    const FUND_REMOVAL_METHOD_CODES = "AsCodeFundRemovalMethod";

    const [request, setRequest] = useState<CreatePlanFundRequest>(new CreatePlanFundRequest());
    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [removalMethodCodes, setRemovalMethodCodes] = useState<BasicEntity[]>([]);
    const [optionsFund, setOptionsFund] = useState<Options[]>([]);
    const [loading, load] = useLoading();
    const [primaryCompany, setPrimaryCompany] = useState('');

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [errorValidation, setErrorValidation] = useState<ErrorValidation>(new ErrorValidation());

    const optionsPrimaryCompany = useMemo(() =>
        [{label: companies.length > 0 ? 'Select Primary Company' : 'No Primary Company', value: ''},
            ...companies.map((c) => ({
                label: c.companyName,
                value: c.companyGuid,
            }))], [companies]);

    const optionsRemovalMethod = useMemo(() => [
        {label: removalMethodCodes.length > 0 ? 'Select Removal Method Code' : 'No Removal Method Code', value: ''},
        ...removalMethodCodes.map((c) => ({
            label: c.name,
            value: c.value,
        }))
    ], [removalMethodCodes]);

    const optionsRemovalDepositLevelTracking = useMemo(() =>
        [{ label: depositLevelTrackingValues.length > 0 ? 'Select Deposit Level Tracking' : 'No Deposit Level Tracking', value: '' },
            ...depositLevelTrackingValues.map((c) => ({
                label: c,
                value: c,
            }))], [depositLevelTrackingValues]);

    const fetchData = async () => {
        setCompanies(await companyService.getPrimaryCompanies());
        setRemovalMethodCodes(await entityService.getCodes(FUND_REMOVAL_METHOD_CODES));
    };
    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides={[
                    { name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code }
                ]}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderPrimaryCompanyField = () => {
        return (
            <InputText
                type='custom-select'
                value={primaryCompany}
                label="Primary Company"
                feedbackMsg={errorValidation.primaryCompany}
                disabled={optionsPrimaryCompany.length === 0}
                options={optionsPrimaryCompany}
                onChange={(o: Options) => handlePrimaryCompanyChanged(o.value)}
                required
            />
        );
    };

    const renderFundField = () => {
        return (
            <InputText
                type='custom-select'
                value={request.fundGUID}
                label="Fund"
                feedbackMsg={errorValidation.fundGUID}
                disabled={optionsFund.length === 0}
                options={optionsFund}
                onChange={(o: Options) => handleFieldChanged('fundGUID', o.value)}
                required
            />
        );
    };

    const renderRemovalPrecedenceField = () => {
        return (
            <InputText
                type='number'
                value={request.removalPrecedence}
                label="Removal Precedence"
                onChange={(value: string) => handleFieldChanged('removalPrecedence', value)}
            />
        );
    };

    const renderRemovalMethodCodeField = () => {
        return (
            <InputText
                type='custom-select'
                value={request.removalMethodCode}
                label="Removal Method Code"
                disabled={optionsRemovalMethod.length === 0}
                options={optionsRemovalMethod}
                onChange={(o: Options) => handleFieldChanged('removalMethodCode', o.value)}
            />
        );
    };

    const renderDepositLevelTrackingField = () => {
        return (
            <InputText
                type='custom-select'
                value={request.depositLevelTracking}
                label="Removal Deposit Level Tracking"
                disabled={optionsRemovalDepositLevelTracking.length === 0}
                options={optionsRemovalDepositLevelTracking}
                onChange={(o: Options) => handleFieldChanged('depositLevelTracking', o.value)}
            />
        );
    };

    const handlePrimaryCompanyChanged = async (val: string) => {
        setPrimaryCompany(val);
        const funds = await basicEntityService.getFundByCompanyGuid(val);
        setOptionsFund([
            { label: funds.length > 0 ? 'Select Fund' : 'No Fund', value: ''},
            ...funds.map((f) => ({ label: f.name, value: f.value}))
        ]);
        setErrorValidation(produce(errorValidation, (draft => {
            draft.primaryCompany = '';
        })))
    };

    const handleFieldChanged = (field: 'fundGUID' | 'removalPrecedence' | 'removalMethodCode' | 'depositLevelTracking', value: string) => {
        setRequest(
            produce(request, (draft) => {
                if(field === 'removalPrecedence') {
                    draft.removalPrecedence = value === '' ? undefined : parseInt(value, 10);
                } else {
                    draft[field] = value;
                }
            }),
        );

        if(field === 'fundGUID') {
            setErrorValidation(produce(errorValidation, (draft => {
                draft.fundGUID = '';
            })));
        }
    }

    const validateForm = () => {
        let isValid = true;
        const newError = new ErrorValidation();

        if(!primaryCompany) {
            newError.primaryCompany = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        if(!request.fundGUID) {
            newError.fundGUID = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        setShowMessageOverride(!isOverrideValid);
        setErrorValidation(newError);
        return isValid && isOverrideValid
    }
    const createPlanFund = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            if (request.overrideGuid != null) {
                request.planGUID = request.overrideGuid;
            }
            const planFund = await entityService.createPlanFund(request);
            const entityInformation = await entityInformationService.getEntityInformation(
                planFund.entityType,
                planFund.getGuid(),
                'DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    });

    return (
        <FrameworkComponent
            title='Create Plan Fund'
            loading={loading}
            onSubmit={createPlanFund}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    {renderPrimaryCompanyField()}
                    {renderFundField()}
                    {renderRemovalPrecedenceField()}
                    {renderRemovalMethodCodeField()}
                    {renderDepositLevelTrackingField()}
                </PanelSectionContainer>
            </CollapseContainer>
            <Loading loading={loading} />
            <CollapseContainer title={'Override'} defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

PlanFundCreationWizard.defaultProps = {
    companyService: defaultCompanyService,
    entityService: defaultEntitiesService,
    basicEntityService: defaultBasicEntityService,
    entityInformationService: defaultEntityInformationService,
};

export default PlanFundCreationWizard;

class ErrorValidation {
    [immerable] = true;
    primaryCompany = '';
    fundGUID = '';
}
