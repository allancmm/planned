import { AutomatedTestStepChild } from './automatedTestStepChild';

export default class AutomatedTestMath extends AutomatedTestStepChild {
    type: string = 'Math';
    level: number = 3;

    public xml: string = '<Math>\n' +
        '   <MathVariables>\n' +
        '      <!-- Use OIPA XML configuration to add mathvariable, functions, etc... -->\n' +
        '   </MathVariables>\n' +
        '</Math>';
}
