import {DuplicatePlan} from '../entities/duplicatePlan';
import {DuplicateProduct} from '../entities/duplicateProduct';
import {DuplicateTransaction} from "../entities/duplicateTransaction";
import {DuplicateBusinessRules} from "../entities/duplicateBusinessRules";
import EntityInformation from "../entities/tabData/entityInformation";
import { DuplicateMapsRule } from '../entities/duplicateMapRule';

export default interface EntityDuplicateRepository {
    duplicateBusinessRules(businessRules: DuplicateBusinessRules): Promise<EntityInformation>;
    duplicatePlan(plan: DuplicatePlan): Promise<EntityInformation[]>;
    duplicateProduct(product: DuplicateProduct): Promise<EntityInformation[]>;
    duplicateTransaction(transaction: DuplicateTransaction): Promise<EntityInformation[]>;
    duplicateMap(map: DuplicateMapsRule): Promise<EntityInformation>;
}