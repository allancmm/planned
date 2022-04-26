import {
    ExternalRuleCache,
    InitIntellisenseDataDto,
} from '../../../containers//editor/monaco/intellisense/intellisense/subIntellisense/utils/intellisense';
import Snippet from '../../domain/entities/intellisense/snippet';
import { EntityType } from '../../domain/enums/entityType';
import IntellisenseRepository from '../../domain/repositories/intellisenseRepository';
import { isGuid } from '../../util/stringUtil';
import { ApiGateway } from '../config/apiGateway';

export default class IntellisenseApiRepository implements IntellisenseRepository {
    constructor(private api: ApiGateway) {}

    initData = async (ruleGuid: string): Promise<InitIntellisenseDataDto> => {
        if (isGuid(ruleGuid)) {
            return this.api.get(`/editor/intellisense/?ruleGuid=${ruleGuid}`, { outType: InitIntellisenseDataDto });
        }
        return Promise.resolve(new InitIntellisenseDataDto());
    };

    loadRule = async (ruleName: string, isTransaction: boolean, byName: boolean): Promise<ExternalRuleCache> => {
        return this.api.get(`/editor/intellisense/${ruleName}?isTransaction=${isTransaction}&byName=${byName}`, {
            outType: ExternalRuleCache,
        });
    };

    /*lists*/
    loadFunctionList = async (): Promise<string[]> => {
        return this.api.getArray('/editor/intellisense/lists/function');
    };
    loadAttachedRulesList = async (transactionGuid: string): Promise<string[]> => {
        return this.api.getArray(`/editor/intellisense/lists/attachedRules?transactionGuid=${transactionGuid}`);
    };
    loadCopyBookList = async (): Promise<string[]> => {
        return this.api.getArray('/editor/intellisense/lists/copyBooks');
    };
    loadTransactionList = async (): Promise<string[]> => {
        return this.api.getArray('/editor/intellisense/lists/transactions');
    };
    loadPlanList = async (): Promise<string[]> => {
        return this.api.getArray('/editor/intellisense/lists/plan');
    };
    loadSegmentNameList = async (): Promise<string[]> => {
        return this.api.getArray('/editor/intellisense/lists/segmentName');
    };
    loadMultiFieldsList = async (): Promise<string[]> => {
        return this.api.getArray('/editor/intellisense/lists/multiFields');
    };
    getSnippets = async (): Promise<Snippet[]> => {
        return this.api.getArray('/editor/intellisense/snippets');
    };

    /* smart snippets*/
    loadFunctionDefinition = async (fctName: string, ruleGuid: string, entityType: EntityType): Promise<string> => {
        return this.api.get(
            `/editor/intellisense/definition/function?functionName=${fctName}&ruleGuid=${ruleGuid}&entityType=${entityType}`,
        );
    };

    fetchCopyBookDeclaration = async (name: string, ruleGuid: string, entityType: EntityType): Promise<string> => {
        return this.api.get(
            `/editor/intellisense/definition/copyBook?copyBookName=${name}&ruleGuid=${ruleGuid}&entityType=${entityType}`,
        );
    };
}
