import {Button} from '@equisoft/design-elements-react';
import {DateInput, Loading, TextInput, useLoading} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {ButtonSection} from '../../../components/general';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import {PanelTitle} from '../../../components/general/sidebar/style';
import {defaultEntityDuplicateService, defaultEntityInformationService} from '../../../lib/context';
import CreatePlanRequest from '../../../lib/domain/entities/createPlanRequest';
import {DuplicatePlan} from '../../../lib/domain/entities/duplicatePlan';
import EntityDuplicateService from '../../../lib/services/entityDuplicateService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import {OverrideEnumType} from '../../general/components/overrideEnum';
import StateGeneralProps from '../../general/components/stateGeneralProps';
import {CheckoutSwitch} from '../general/checkout';
import {CopyAllSwitch} from '../general/copyAll';
import {DuplicateContainer} from '../styles';

const request = new CreatePlanRequest();

type TypeAllowPlan = string | Boolean | Date;

interface PlanDuplicateProp {
    sourcePlan: DuplicatePlan;
    entityDuplicateService: EntityDuplicateService,
    entityInformationService: EntityInformationService,
}

const PlanDuplicate = ({sourcePlan, entityDuplicateService, entityInformationService}: PlanDuplicateProp) => {
    const dispatch = useTabActions();
    const [loading, load] = useLoading();
    const {closeRightbar} = useContext(RightbarContext);

    const [plan, setPlan] = useState<DuplicatePlan>(sourcePlan);
    const [overrideLevelCode, setOverrideLevelCode] = useState('');
    const [generalComponentState, setGeneralComponentState] = useState<StateGeneralProps>();

    const duplicatePlan = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        plan.overrideLevel = overridesList.find((o) => o.value === overrideLevelCode)?.name ?? '';
        if (plan.overrideLevel === OverrideEnumType.PCOMPANY.value) {
            plan.overrideLevel = OverrideEnumType.COMPANY.value;
        }
        const entitiesCreated = await entityDuplicateService.duplicatePlan(plan);
        for (const entity of entitiesCreated) {
            const entityInformation = await entityInformationService.getEntityInformation(
                entity.entityType,
                entity.getGuid(),
                'DATA'
            );
            dispatch({type: OPEN, payload: {data: entityInformation}});
        }
        toast.success('Plan duplicated successfully');
        closeRightbar();
    });

    useEffect(() => {
        generalComponentState?.guid && onChange('overrideGuid', generalComponentState?.guid);
    }, [generalComponentState]);

    useEffect(() => {
        setPlan(produce(plan, (draft) => {
            draft.newEntityName = sourcePlan.newEntityName;
            draft.createCheckedOut = sourcePlan.createCheckedOut;
        }));
    }, [sourcePlan.sourceEntityGuid]);

    const overridesList = useMemo(() => {
        return [
            {name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code},
            {name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code}
        ];
    }, [plan.overrideTypeCode]);

    const onChange = (field: keyof DuplicatePlan, value: TypeAllowPlan) => {
        setPlan(produce(plan, (draft) => {
            (draft[field] as TypeAllowPlan) = value;
        }));
    };

    return (
        <>
            <PanelTitle>Duplicate Plan</PanelTitle>

            <DuplicateContainer onSubmit={duplicatePlan}>
                <Loading loading={loading}/>

                <TextInput
                    label="New Plan Name"
                    defaultValue={plan.newEntityName}
                    required
                    onChange={(e) => onChange('newEntityName', e.target.value)}
                />
                <DateInput
                    label="Effective From"
                    selected={plan.newEffectiveDate}
                    required
                    onChange={(d) => onChange('newEffectiveDate', d as Date)}
                />
                <DateInput
                    label="Effective To"
                    selected={plan.newExpirationDate}
                    onChange={(d) => onChange('newExpirationDate', d as Date)}
                />
                <hr/>
                <GeneralComponent
                    data={request}
                    warningMessage=""
                    filteredOverrides={overridesList}
                    setGeneralComponentState={setGeneralComponentState}
                    setOverrideLevelCode={setOverrideLevelCode}
                />
                <hr/>
                <CheckoutSwitch createCheckedOut={plan.createCheckedOut} onChange={onChange}/>
                <CopyAllSwitch copyAllRules={plan.copyAllRules} onChange={onChange}/>

                <ButtonSection>
                    <Button buttonType="primary"
                            label="Save"/>
                </ButtonSection>
            </DuplicateContainer>
        </>
    );
};

PlanDuplicate.defaultProps = {
    entityDuplicateService: defaultEntityDuplicateService,
    entityInformationService: defaultEntityInformationService
};

export default PlanDuplicate;