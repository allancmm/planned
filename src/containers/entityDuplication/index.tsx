import React from 'react';
import { DuplicateEntity } from '../../lib/domain/entities/duplicateEntity';
import { EntityType } from '../../lib/domain/enums/entityType';
import {
    toDuplicateBusinessRulesEntity,
    toDuplicateMapEntity,
    toDuplicatePlanEntity,
    toDuplicateProductEntity,
    toDuplicateTransactionEntity,
} from '../../lib/infra/assembler/entityDuplicateAssembler';
import BusinessRules from './businessRules';
import MapGroup from './mapGroup';
import PlanDuplicate from './plan';
import ProductDuplicate from './product';
import TransactionDuplicate from './transaction';

interface EntityDuplicationProp {
    source: DuplicateEntity;
    entityType: EntityType;
}

const EntityDuplication = ({ source, entityType }: EntityDuplicationProp) => {
    switch (entityType) {
        case 'BUSINESS_RULES':
            return <BusinessRules sourceBusinessRules={toDuplicateBusinessRulesEntity(source)} />;
        case 'MAP':
            return <MapGroup sourceMapGroup={toDuplicateMapEntity(source)} />;
        case 'PLAN':
            return <PlanDuplicate sourcePlan={toDuplicatePlanEntity(source)} />;
        case 'PRODUCT':
            return <ProductDuplicate sourceProduct={toDuplicateProductEntity(source)} />;
        case 'TRANSACTIONS':
            return <TransactionDuplicate sourceTransaction={toDuplicateTransactionEntity(source)} />;
        default:
            return <></>;
    }
};

EntityDuplication.defaultProps = {};

export default EntityDuplication;
