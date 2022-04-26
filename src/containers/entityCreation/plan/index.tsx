import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import { InputText, Options } from "../../../components/general";
import {immerable, produce} from 'immer';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import { defaultEntitiesService, defaultEntityInformationService } from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import CreatePlanRequest from '../../../lib/domain/entities/createPlanRequest';
import Currency from '../../../lib/domain/entities/currency';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import FrameworkComponent from "../frameworkComponent";
import {validateRequiredFields} from "../util";

const PLAN_ALLOCATION_CODES = 'AsCodePlanAllocationMethod';
const SYSTEM_CODES = 'AsCodeSystem';
const mixedValuation = ['Y', 'N', 'T'];
const pointInTimeValuation = ['Y', 'N'];

const fieldsString = ['planName', 'currencyCode', 'marketMakerGUID', 'pointInTimeValuation', 'mixedValuation', 'planAllocationMethod', 'systemCode'] as const;
type TypeFieldString = typeof fieldsString[number];
const isFieldString = (field: any) : field is TypeFieldString => fieldsString.includes(field);

type TypeFieldDate = 'effectiveDate' | 'expirationDate';

const fieldsRequired = ['planName', 'planAllocationMethod', 'effectiveDate'] as const;
type FieldRequired = typeof fieldsRequired[number];
const isRequiredField = (field: any) : field is FieldRequired => fieldsRequired.includes(field);

class ErrorPlan {
    [immerable] = true;
    planName = '';
    planAllocationMethod = '';
    effectiveDate = '';
}
const FILTERED_OVERRIDES = [
    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
    { name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code },
];

interface PlanCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const PlanCreationWizard = ({ entityService, entityInformationService }: PlanCreationProps) => {
    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);
    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreatePlanRequest>(new CreatePlanRequest());
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [marketMakers, setMarketMakers] = useState<BasicEntity[]>([]);
    const [systemCodes, setSystemCodes] = useState<BasicEntity[]>([]);
    const [planAllocationsCodes, setPlanAllocationsCodes] = useState<BasicEntity[]>([]);

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorPlan());

    const optionsCurrencyCode = useMemo(() => [
        { label: currencies.length > 0 ? 'Select Currency Code' : ' No Currency Code Available', value: '' },
        ...currencies.map((c) => ({
            label: c.currencyCode,
            value: c.currencyCode,
        }))
    ], [currencies]);

    const optionsMarketMaker = useMemo(() => [
        { label: marketMakers.length > 0 ? 'Select Market Maker' : ' No Market Maker Available', value: ''},
        ...marketMakers.map((c) => ({
            label: c.name,
            value: c.value,
        }))], [marketMakers]);

    const optionsPointTime = useMemo(() => [
        { label: pointInTimeValuation.length > 0
                ? 'Select Point In Time Valuation'
                : ' No Point In Time Valuation Available', value: ''},
        ...pointInTimeValuation.map((p) => ({ value: p, label: p }))
    ], [pointInTimeValuation]);

    const optionsMixedValuation = useMemo(() => [
        { label: mixedValuation.length > 0 ? 'Select Mixed Valuation' : ' No Mixed Valuation Available', value: ''},
        ...mixedValuation.map((m) => ({ value: m, label: m }))
    ], [mixedValuation]);

    const optionsPlanAllocation = useMemo(() => [
        { label: planAllocationsCodes.length > 0
                ? 'Select Plan Allocation Method'
                : ' No Plan Allocation Method Available', value: ''},
        ...planAllocationsCodes.map((c) => ({
            label: c.name,
            value: c.value,
        }))
    ], [planAllocationsCodes]);

    const optionsSystemCode = useMemo(() => [
        { label: systemCodes.length > 0 ? 'Select System Code' : ' No System Code Available', value: ''},
        ...systemCodes.map((c) => ({
            label: c.name,
            value: c.value,
        }))
    ], [systemCodes]);

    const fetchData = load(async () => {
        const entityInfo: EntityInformation = await entityInformationService.getEntityInformation(
            'CURRENCY',
            Currency.guid,
            'CURRENCY',
        );
        setCurrencies(entityInfo.currencies);
        setMarketMakers(await entityService.getMarketMaker());
        setSystemCodes(await entityService.getCodes(SYSTEM_CODES));
        setPlanAllocationsCodes(await entityService.getCodes(PLAN_ALLOCATION_CODES));
    });

    useEffect(() => {
        fetchData();
    }, []);

    const renderPlanNameField = () => {
        return (
            <InputText
                type='text'
                label="Plan Name"
                value={request.planName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('planName', e.target.value)}
                required
                feedbackMsg={error.planName}
            />
        );
    };

    const renderCurrencyCode = () => {
        return (
            <InputText
                type='custom-select'
                label="Currency Code"
                value={request.currencyCode}
                disabled={optionsCurrencyCode.length === 0}
                options={optionsCurrencyCode}
                onChange={(o: Options) => handleFieldChanged('currencyCode', o.value)}
            />
        );
    };

    const renderMarketMaker = () => {
        return (
            <InputText
                type='custom-select'
                label="Market Maker"
                value={request.marketMakerGUID}
                disabled={optionsMarketMaker.length === 0}
                options={optionsMarketMaker}
                onChange={(o: Options) => handleFieldChanged('marketMakerGUID', o.value)}
            />
        );
    };

    const renderPointInTimeValuation = () => {
        return (
            <InputText
                type='custom-select'
                label="Point In Time Valuation"
                value={request.pointInTimeValuation}
                disabled={optionsPointTime.length === 0}
                options={optionsPointTime}
                onChange={(o: Options) => handleFieldChanged('pointInTimeValuation', o.value)}
            />
        );
    };

    const renderMixedValuation = () => {
        return (
            <InputText
                type='custom-select'
                value={request.mixedValuation}
                label="Mixed Valuation"
                disabled={optionsMixedValuation.length === 0}
                options={optionsMixedValuation}
                onChange={(o: Options) => handleFieldChanged('mixedValuation', o.value)}
            />
        );
    };

    const renderPlanAllocationMethod = () => {
        return (
            <InputText
                type='custom-select'
                label="Plan Allocation Method"
                value={request.planAllocationMethod}
                disabled={optionsPlanAllocation.length === 0}
                options={optionsPlanAllocation}
                onChange={(o: Options) => handleFieldChanged('planAllocationMethod', o.value)}
                required
                feedbackMsg={error.planAllocationMethod}
            />
        );
    };

    const renderSystemCode = () => {
        return (
            <InputText
                type='custom-select'
                label="System Code"
                value={request.systemCode}
                disabled={optionsSystemCode.length === 0}
                options={optionsSystemCode}
                onChange={(o: Options) => handleFieldChanged('systemCode', o.value)}
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
                onChange={(d: Date) => handleFieldChanged('effectiveDate', d)}
                required
                feedbackMsg={error.effectiveDate}
            />
        );
    };

    const renderExpirationDate = () => {
        return (
            <InputText
                type='date'
                label="Effective To"
                startDate={request.expirationDate}
                value={request.expirationDate}
                onChange={(d: Date) => handleFieldChanged('expirationDate', d)}
            />
        );
    };

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                parentType="PLAN"
                filteredOverrides={FILTERED_OVERRIDES}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleFieldChanged = (field: TypeFieldString | TypeFieldDate, value: string | Date) => {
        if(isRequiredField(field)) {
            setError(produce(error, (draft => {
                draft[field] = '';
            })));
        }

        if(isFieldString(field)) {
            setRequest(
                produce(request, (draft) => {
                    draft[field] = value as string;
                }),
            );
            return;
        }
        setRequest(
            produce(request, (draft) => {
                draft[field] = value as Date;
            }),
        );
    };

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createPlan = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        const plan = await entityService.createPlan(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            plan.entityType,
            plan.getGuid(),
            'DATA',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        closeRightbar();
    });

    return (
          <FrameworkComponent
                title='Create Plan'
                loading={loading}
                onSubmit={createPlan}
                onCancel={closeRightbar}
            >
                <CollapseContainer title={'General'} defaultOpened>
                    <PanelSectionContainer>
                        {renderPlanNameField()}
                        {renderCurrencyCode()}
                        {renderMarketMaker()}
                        {renderPointInTimeValuation()}
                        {renderMixedValuation()}
                        {renderPlanAllocationMethod()}
                        {renderSystemCode()}
                        {renderEffectiveDate()}
                        {renderExpirationDate()}
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

PlanCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default PlanCreationWizard;
