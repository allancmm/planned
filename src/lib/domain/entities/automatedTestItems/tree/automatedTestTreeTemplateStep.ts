import AutomatedTestStep from "../automatedTestStep";

type TypeDirectory = 'FOLDER' | 'FILE' | '';

export default class AutomatedTestTreeTemplateStep {
    name = '';
    path = '';
    type : TypeDirectory = '';
    templateStep = new AutomatedTestStep();
    children : AutomatedTestTreeTemplateStep[]  = [];
}