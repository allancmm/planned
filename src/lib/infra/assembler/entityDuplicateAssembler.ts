import {getOverrideFromDisplayName} from '../../../containers/general/components/overrideEnum';
import {DuplicateBusinessRules} from '../../domain/entities/duplicateBusinessRules';
import {DuplicateEntity} from '../../domain/entities/duplicateEntity';
import { DuplicateMapsRule } from '../../domain/entities/duplicateMapRule';
import {DuplicatePlan} from '../../domain/entities/duplicatePlan';
import {DuplicateProduct} from '../../domain/entities/duplicateProduct';
import {DuplicateTransaction} from '../../domain/entities/duplicateTransaction';
import {DuplicateBusinessRulesRequest, DuplicateMapRequest, DuplicatePlanRequest, DuplicateProductRequest, DuplicateTransactionRequest} from '../request/entityDuplicate';

export const toDuplicateBusinessRulesRequest = (businessRules: DuplicateBusinessRules): DuplicateBusinessRulesRequest => {
    return {
        overrideLevel: getOverrideFromDisplayName(businessRules.overrideLevel) ?? 'BAD_GUID',
        overrideGuid: businessRules.overrideGuid,
        newBusinessRuleName: businessRules.newEntityName,
        sourceBusinessRuleGuid: businessRules.sourceEntityGuid,
        createCheckedOut: businessRules.createCheckedOut,
        stateCode: businessRules.stateCode,
        systemCode: businessRules.systemCode
    };
};

export const toDuplicateMapRequest = (map: DuplicateMapsRule): DuplicateMapRequest => {
    return {
        sourceMapGuid: map.sourceEntityGuid,
        newMapName: map.newEntityName,
        createCheckedOut: map.createCheckedOut
    };
};

export const toDuplicatePlanRequest = (plan: DuplicatePlan): DuplicatePlanRequest => {
    return {
        overrideLevel: getOverrideFromDisplayName(plan.overrideLevel) ?? 'BAD_GUID',
        overrideGuid: plan.overrideGuid,
        newPlanName: plan.newEntityName,
        newEffectiveDate: plan.newEffectiveDate,
        newExpirationDate: plan.newExpirationDate,
        sourcePlanGuid: plan.sourceEntityGuid,
        createCheckedOut: plan.createCheckedOut,
        copyAllRules: plan.copyAllRules
    };
};

export const toDuplicateProductRequest = (product: DuplicateProduct): DuplicateProductRequest => {
    return {
        overrideLevel: getOverrideFromDisplayName(product.overrideLevel) ?? 'BAD_GUID',
        overrideGuid: product.overrideGuid,
        newProductName: product.newEntityName,
        description: product.description,
        newEffectiveDate: product.newEffectiveDate,
        newExpirationDate: product.newExpirationDate,
        sourceProductGuid: product.sourceEntityGuid,
        createCheckedOut: product.createCheckedOut,
        copyAllRules: product.copyAllRules
    };
};

export const toDuplicateTransactionRequest = (transaction: DuplicateTransaction): DuplicateTransactionRequest => {
    return {
        overrideLevel: getOverrideFromDisplayName(transaction.overrideLevel) ?? 'BAD_GUID',
        overrideGuid: transaction.overrideGuid,
        sourceTransactionGuid: transaction.sourceEntityGuid,
        newTransactionName: transaction.newEntityName,
        createCheckedOut: transaction.createCheckedOut
    };
};

export const toDuplicateBusinessRulesEntity = (sourceEntity: DuplicateEntity): DuplicateBusinessRules => {
    return {
        overrideTypeCode: sourceEntity.overrideTypeCode,
        typeCode: sourceEntity.typeCode,
        newEntityName: sourceEntity.newEntityName,
        overrideLevel: sourceEntity.overrideLevel,
        overrideGuid: sourceEntity.overrideGuid,
        sourceEntityGuid: sourceEntity.sourceEntityGuid,
        createCheckedOut: false,
        stateCode: undefined,
        systemCode: undefined
    };
};

export const toDuplicateMapEntity = (sourceEntity: DuplicateEntity): DuplicateMapsRule => {
    return {
        overrideTypeCode: sourceEntity.overrideTypeCode,
        typeCode: sourceEntity.typeCode,
        newEntityName: sourceEntity.newEntityName,
        overrideLevel: sourceEntity.overrideLevel,
        overrideGuid: sourceEntity.overrideGuid,
        sourceEntityGuid: sourceEntity.sourceEntityGuid,
        createCheckedOut: false,
    };
};

export const toDuplicatePlanEntity = (sourceEntity: DuplicateEntity): DuplicatePlan => {
    return {
        overrideTypeCode: sourceEntity.overrideTypeCode,
        typeCode: sourceEntity.typeCode,
        newEntityName: sourceEntity.newEntityName,
        overrideLevel: sourceEntity.overrideLevel,
        overrideGuid: sourceEntity.overrideGuid,
        sourceEntityGuid: sourceEntity.sourceEntityGuid,
        createCheckedOut: false,
        copyAllRules: false
    };
};

export const toDuplicateProductEntity = (sourceEntity: DuplicateEntity): DuplicateProduct => {
    return {
        overrideTypeCode: sourceEntity.overrideTypeCode,
        typeCode: sourceEntity.typeCode,
        newEntityName: sourceEntity.newEntityName,
        overrideLevel: sourceEntity.overrideLevel,
        overrideGuid: sourceEntity.overrideGuid,
        sourceEntityGuid: sourceEntity.sourceEntityGuid,
        createCheckedOut: false,
        copyAllRules: false
    };
};

export const toDuplicateTransactionEntity = (sourceEntity: DuplicateEntity): DuplicateTransaction => {
    return {
        overrideTypeCode: sourceEntity.overrideTypeCode,
        typeCode: sourceEntity.typeCode,
        newEntityName: sourceEntity.newEntityName,
        overrideLevel: sourceEntity.overrideLevel,
        overrideGuid: sourceEntity.overrideGuid,
        sourceEntityGuid: sourceEntity.sourceEntityGuid,
        createCheckedOut: false
    };
};
