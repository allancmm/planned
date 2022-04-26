import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import { StepFieldsFixedContainer, StepFieldContainer } from "../style";

import InputText, { Options } from "../../../../../components/general/inputText";

import AutomatedTestStep, {
    getStepActionFromEntity, getStepActionFromName, getStepChild, PremadeStepActions,
    StepActionType
} from "../../../../../lib/domain/entities/automatedTestItems/automatedTestStep";
import AutomatedTestActionSoapCard from "../../automatedTestStepCards/automatedtestActionSoap";
import AutomatedTestActionSoap from "../../../../../lib/domain/entities/automatedTestItems/automatedTestActionSoap";
import AutomatedTestAssessmentFileCompareCard from "../../automatedTestStepCards/automatedTestAssessmentFileCompareCard";
import AutomatedTestAssessmentFileCompare
    from "../../../../../lib/domain/entities/automatedTestItems/automatedTestAssessmentFileCompare";
import {AutomatedTestStepChildType} from "../../../../../lib/domain/entities/automatedTestItems/automatedTestStepChild";
import ActionDefinition from "../../../../../lib/domain/entities/automatedTestItems/testDefinitions/actionDefinition";
import {defaultAutomatedTestService} from "../../../../../lib/context";
import AutomatedTestService from "../../../../../lib/services/automatedTestService";
import { TypeField, ValueType } from "../../index";

interface StepFieldsProps {
    automatedTestStep: AutomatedTestStep,
    automatedTestService: AutomatedTestService;
    handleTypeChange(field: TypeField, value : ValueType, editorWillChange?: boolean) : void,
    load(cb: (...args: any[]) => any) : (...args: any[]) => Promise<any>,
}

const StepFields = ({ automatedTestStep,
                      handleTypeChange,
                      load,
                      automatedTestService
                    } : StepFieldsProps) => {

    const [stepActions, setStepActions] = useState<StepActionType[]>([]);
    const [actionDefinitions, setActionDefinitions] = useState<ActionDefinition[]>([]);

    const stepActionsOptions = useMemo(() =>
        stepActions.map((s) => ({label: s.name, value: s.name})), [stepActions]);

    const populateStepActions = async () => {
        const newActionDefinitions: ActionDefinition[] = await load(automatedTestService.getActionDefinitions)();
        const newStepActions: StepActionType[] = [];

        if (newActionDefinitions.length > 0) {
            newActionDefinitions.forEach((action) => newStepActions.push({ type: 'ActionSoap', name: action.name }));
        }

        setActionDefinitions(newActionDefinitions);
        setStepActions(newStepActions.concat(PremadeStepActions));
    };

    useEffect(() => {
        populateStepActions();
    }, []);

    const onTypeChange = (field: TypeField, value: ValueType, editorWillChange?: boolean) => {
        switch (field) {
            case "typeStep":
                const newStepAction = getStepActionFromName(stepActions, value as string);
                const child = getStepChild(newStepAction, actionDefinitions);
                handleTypeChange(field, child);
                break;
            case 'childField':
                handleTypeChange(field, value as AutomatedTestStepChildType, editorWillChange);
                break;
            case "nameStep":
                handleTypeChange(field, value);
                break;
        }
    };
    return (
        <StepFieldsFixedContainer>
            <StepFieldContainer>
                <InputText
                    type='text'
                    label='Step Name'
                    value={automatedTestStep.id}
                    disabled={automatedTestStep.disabled}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onTypeChange('nameStep', e.target.value)}
                />
            </StepFieldContainer>

            <StepFieldContainer>
                <InputText
                    type='select'
                    label='Type'
                    options={stepActionsOptions}
                    value={getStepActionFromEntity(automatedTestStep?.child)?.name}
                    onChange={(o : Options) => onTypeChange('typeStep', o.value)}
                    numberOfItemsVisible={5}
                    disabled={automatedTestStep.disabled}
                />
            </StepFieldContainer>


            {automatedTestStep.child &&
            (() => {
                switch (automatedTestStep.child.type) {
                    case 'ActionSoap':
                        return (
                            <AutomatedTestActionSoapCard
                                actionSoap={automatedTestStep.child as AutomatedTestActionSoap}
                                handleStepChildChange={(actionSoap: AutomatedTestActionSoap) =>
                                    onTypeChange('childField', actionSoap, true)
                                }
                                disabled={automatedTestStep.disabled}
                            />
                        );
                    case 'AssessmentFileCompare':
                        return (
                            <AutomatedTestAssessmentFileCompareCard
                                assessmentFileCompare={
                                    automatedTestStep.child as AutomatedTestAssessmentFileCompare
                                }
                                handleStepChildChange={onTypeChange.bind(null, 'childField')}
                                disabled={automatedTestStep.disabled}
                            />
                        );
                    default:
                        return null;
                }
            })()}

        </StepFieldsFixedContainer>
    );
}
StepFields.defaultProps = {
    automatedTestService: defaultAutomatedTestService
}
export default StepFields;