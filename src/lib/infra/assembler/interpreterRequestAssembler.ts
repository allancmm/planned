import { EntityLevel } from '../../domain/enums/entityLevel';
import {
    EvaluateActivityRequest,
    EvaluateCalculateRequest,
    EvaluateExposedComputationsRequest,
    EvaluateFileRequest,
    EvaluateFunctionsRequest,
    EvaluateInquiryScreenRequest,
    EvaluatePolicyValuesRequest,
    EvaluateScreenRequest,
    EvaluateTransactionRequest,
} from '../request/interpreterRequests';

export const toTransactionRequest = (
    entityLevel: EntityLevel,
    entityGuid: string,
    ruleGuid: string,
    parameters: string,
    section: string,
): EvaluateTransactionRequest => ({ entityLevel, entityGuid, transactionGuid: ruleGuid, parameters, section });

export const toActivityRequest = (ruleGuid: string, section: string): EvaluateActivityRequest => ({
    activityGuid: ruleGuid,
    section,
});

export const toFunctionsRequest = (
    entityLevel: EntityLevel,
    entityGuid: string,
    ruleGuid: string,
    parameters: string,
    section: string,
): EvaluateFunctionsRequest => ({ entityLevel, entityGuid, businessRuleGuid: ruleGuid, parameters, section });

export const toScreenRequest = (
    entityLevel: EntityLevel,
    entityGuid: string,
    ruleGuid: string,
    parameters: string,
    section: string,
): EvaluateScreenRequest => ({ entityLevel, entityGuid, businessRuleGuid: ruleGuid, parameters, section });

export const toInquiryScreenRequest = (
    entityLevel: EntityLevel,
    entityGuid: string,
    ruleGuid: string,
    parameters: string,
    section: string,
): EvaluateInquiryScreenRequest => ({ entityLevel, entityGuid, inquiryScreenGuid: ruleGuid, parameters, section });

export const toExposedComputationsRequest = (
    ruleGuid: string,
    parameters: string,
): EvaluateExposedComputationsRequest => ({ entityGuid: ruleGuid, requestFile: parameters });

export const toCalculateRequest = (ruleGuid: string): EvaluateCalculateRequest => ({ segmentGuid: ruleGuid });

export const toFilesRequest = (ruleGuid: string, parameters: string): EvaluateFileRequest => ({
    asFileGuid: ruleGuid,
    requestFile: parameters,
});

export const toPolicyValuesRequest = (entityGuid: string, effectiveDate: Date): EvaluatePolicyValuesRequest => ({
    policyGuid: entityGuid,
    effectiveDate,
});
