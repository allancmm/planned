import {
    InitIntellisenseDataDto,
    ExternalRuleCache,
} from '../../../containers/editor/monaco/intellisense/intellisense/subIntellisense/utils/intellisense';

export default interface IntellisenseRepository {
    initData(ruleGuid: string): Promise<InitIntellisenseDataDto>;
    loadRule(ruleName: string, isTransaction: boolean, byName: boolean): Promise<ExternalRuleCache>;

    /*lists*/
    loadFunctionList(): Promise<string[]>;
    loadAttachedRulesList(transactionGuid: string): Promise<string[]>;
    loadCopyBookList(): Promise<string[]>;
    loadTransactionList(): Promise<string[]>;
    loadPlanList(): Promise<string[]>;
    loadSegmentNameList(): Promise<string[]>;
    loadMultiFieldsList(): Promise<string[]>;
}
