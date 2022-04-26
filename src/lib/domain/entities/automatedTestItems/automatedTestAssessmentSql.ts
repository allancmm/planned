import { AutomatedTestStepChild } from './automatedTestStepChild';

export default class AutomatedTestAssessmentSql extends AutomatedTestStepChild {
    type: string = 'AssessmentSql';
    level: number = 3;

    public xml: string = '<Assessments>\n' +
        '   <!-- Use OIPA XML configuration to fill assessments... -->\n' +
        '   <Assessment DESCRIPTION="">\n' +
        '       <Observable></Observable>\n' +
        '       <ExpectedResult></ExpectedResult>\n' +
        '   </Assessment>\n' +
        '</Assessments>';
}
