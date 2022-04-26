import { EntityLevel } from '../../domain/enums/entityLevel';

export class DataFileGenerationRequest {
    public dataFileName: string = '';
    public entityLevel: EntityLevel = 'NONE';
    public genericXMLOption: string = '';
    public entityGuid: string = '';
    public systemCode: string = '';
    public stateCode: string = '';
}
