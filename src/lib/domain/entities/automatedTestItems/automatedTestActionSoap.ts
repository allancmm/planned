import { AutomatedTestStepChild } from './automatedTestStepChild';

export default class AutomatedTestActionSoap extends AutomatedTestStepChild {
    type: string = 'ActionSoap';
    level: number = 3;

    public actionDefinition: string = '';
    public useDataFile = false;
    public xml: string = '';
    public dataFileName?: string;
}
