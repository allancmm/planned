import {DuplicatePlan} from '../domain/entities/duplicatePlan';
import {DuplicateProduct} from '../domain/entities/duplicateProduct';
import EntityDuplicateRepository from "../domain/repositories/EntityDuplicateRepository";
import { DuplicateTransaction } from "../domain/entities/duplicateTransaction";
import { DuplicateBusinessRules } from "../domain/entities/duplicateBusinessRules";
import EntityInformation from "../domain/entities/tabData/entityInformation";
import { DuplicateMapsRule } from '../domain/entities/duplicateMapRule';

export default class EntityDuplicateService {

    constructor(private entityDuplicateRepository: EntityDuplicateRepository) {}

    duplicateBusinessRules = async (businessRules: DuplicateBusinessRules): Promise<EntityInformation> =>
        this.entityDuplicateRepository.duplicateBusinessRules(businessRules);

    duplicateMap = async (map: DuplicateMapsRule): Promise<EntityInformation> =>
        this.entityDuplicateRepository.duplicateMap(map);
        
    duplicatePlan = async (plan: DuplicatePlan): Promise<EntityInformation[]> =>
        this.entityDuplicateRepository.duplicatePlan(plan);

    duplicateProduct = async (product: DuplicateProduct): Promise<EntityInformation[]> =>
        this.entityDuplicateRepository.duplicateProduct(product);

    duplicateTransaction = async (transaction: DuplicateTransaction): Promise<EntityInformation[]> =>
        this.entityDuplicateRepository.duplicateTransaction(transaction);

}