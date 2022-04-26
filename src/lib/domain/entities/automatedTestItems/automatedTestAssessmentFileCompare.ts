import { AutomatedTestStepChild } from './automatedTestStepChild';

export default class AutomatedTestAssessmentFileCompare extends AutomatedTestStepChild {
    type: string = 'AssessmentFileCompare';
    level: number = 3;

    public fileToCompare: string = '';
    public expectedResult: string = '';
}
