import { immerable } from 'immer';
import { EntityLevel } from '../enums/entityLevel';
import OverrideSelector from './overrideSelector';

export interface TranslationMap {
    [key: string]: string;
}

export class TransactionMapDto {
    [immerable] = true;
    public code: string = '';
    public text: string = '';
}

export class AttachedRuleDto {
    public name: string = '';
    public isCurrentRule: boolean = false;
}
export default class CreateTransactionRuleRequest extends OverrideSelector{
    [immerable] = true;

    public transactionName: string = '';
    public typeCode: string = '';
    public processingOrder: number = 1;
    public templateName?: string;
    public translations: TranslationMap = {};
    public level: EntityLevel = 'NONE';
    public attachedRules: string[] = [];
    public eligibityType?: string;
    public eligibleStatus: { [eligibleStatusKey: string]: string } = {};
    public securityGroupGuid?: string;

    public createCheckedOut: boolean = true;
}
