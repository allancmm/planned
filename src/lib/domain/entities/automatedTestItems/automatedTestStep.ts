import { immerable } from 'immer';
import AutomatedTestActionSoap from './automatedTestActionSoap';
import AutomatedTestAssessmentFileCompare from './automatedTestAssessmentFileCompare';
import AutomatedTestAssessmentSql from './automatedTestAssessmentSql';
import AutomatedTestMath from './automatedTestMath';
import { AutomatedTestStepChild, AutomatedTestStepChildType } from './automatedTestStepChild';
import ActionDefinition from './testDefinitions/actionDefinition';
import { JsonSubType, Type } from 'class-transformer';

const AutomatedTestStepChildJsonSubType: JsonSubType[] = [
    { value: AutomatedTestActionSoap, name: 'ActionSoap' },
    { value: AutomatedTestAssessmentSql, name: 'AssessmentSql' },
    { value: AutomatedTestAssessmentFileCompare, name: 'AssessmentFileCompare' },
    { value: AutomatedTestMath, name: 'Math' },
];

export default class AutomatedTestStep {
    [immerable] = true;

    level: number = 2;

    public uuid: string = '';
    public id: string = '';

    public disabled: boolean = false;

    public modelId: number = 0;

    public htmlInput: JSX.Element | null = null;

    @Type(() => AutomatedTestStepChild, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'type',
            subTypes: AutomatedTestStepChildJsonSubType,
        },
    })
    public child: AutomatedTestStepChildType = new AutomatedTestMath();
}

export interface StepActionType {
    type: string;
    name: string;
}

export const PremadeStepActions: StepActionType[] = [
    { type: 'AssessmentSql', name: 'Assessment - SQL' },
    { type: 'AssessmentFileCompare', name: 'Assessment - FileCompare' },
    { type: 'Math', name: 'Math' },
];

export const getStepChild = (
    stepAction?: StepActionType,
    actionDefinitions?: ActionDefinition[],
): AutomatedTestStepChildType | null => {
    if (stepAction) {
        switch (stepAction.type) {
            case 'ActionSoap':
                const newActionSoap = new AutomatedTestActionSoap();
                newActionSoap.actionDefinition = stepAction.name;
                newActionSoap.xml =
                    actionDefinitions?.find((ad) => ad.name === newActionSoap.actionDefinition)?.xml || '';
                return newActionSoap;
            case 'AssessmentSql':
                return new AutomatedTestAssessmentSql();
            case 'AssessmentFileCompare':
                return new AutomatedTestAssessmentFileCompare();
            case 'Math':
                return new AutomatedTestMath();
            default:
                return null;
        }
    }
    return null;
};

export const getDefaultValueForStep = (automatedTestStep: AutomatedTestStep): string => {
    const stepChild = automatedTestStep?.child;
    switch (stepChild?.type) {
        case 'ActionSoap':
            return (stepChild as AutomatedTestActionSoap).xml || '';
        case 'Math':
            return (stepChild as AutomatedTestMath).xml || '';
        case 'AssessmentSql':
            return (stepChild as AutomatedTestAssessmentSql).xml || '';
        case 'AssessmentFileCompare':
            return (stepChild as AutomatedTestAssessmentFileCompare).expectedResult || '';
        default:
            return '';
    }
};

export const updateXmlStep = (automatedTestStep: AutomatedTestStep, editorText: string) => {
    switch (automatedTestStep.child?.type) {
        case 'ActionSoap':
            (automatedTestStep.child as AutomatedTestActionSoap).xml = editorText;
            break;
        case 'Math':
            (automatedTestStep.child as AutomatedTestMath).xml = editorText;
            break;
        case 'AssessmentSql':
            (automatedTestStep.child as AutomatedTestAssessmentSql).xml = editorText;
            break;
        case 'AssessmentFileCompare':
            (automatedTestStep.child as AutomatedTestAssessmentFileCompare).expectedResult = editorText;
            break;
    }
    return automatedTestStep;
}

export const getStepActionFromName = (stepActions: StepActionType[], name: string): StepActionType | undefined => {
    return stepActions.find((sa) => sa.name === name);
};

export const getStepActionFromEntity = (entity: AutomatedTestStepChildType): StepActionType | undefined => {
    switch (entity?.type) {
        case 'ActionSoap':
            return { type: 'ActionSoap', name: (entity as AutomatedTestActionSoap).actionDefinition };
        default:
            return PremadeStepActions.find((sa) => sa.type === entity?.type);
    }
};
