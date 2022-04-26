import {DuplicateBusinessRules} from '../../domain/entities/duplicateBusinessRules';
import { DuplicateMapsRule } from '../../domain/entities/duplicateMapRule';
import {DuplicatePlan} from '../../domain/entities/duplicatePlan';
import {DuplicateProduct} from '../../domain/entities/duplicateProduct';
import {DuplicateTransaction} from '../../domain/entities/duplicateTransaction';
import EntityInformation from '../../domain/entities/tabData/entityInformation';
import EntityDuplicateRepository from '../../domain/repositories/EntityDuplicateRepository';
import {
    toDuplicateBusinessRulesRequest,
    toDuplicateMapRequest,
    toDuplicatePlanRequest,
    toDuplicateProductRequest,
    toDuplicateTransactionRequest
} from '../assembler/entityDuplicateAssembler';
import {ApiGateway} from '../config/apiGateway';
import {DuplicateBusinessRulesRequest, DuplicateMapRequest, DuplicatePlanRequest, DuplicateProductRequest, DuplicateTransactionRequest} from '../request/entityDuplicate';


export default class EntityDuplicateApiRepository implements EntityDuplicateRepository {

    constructor(private api: ApiGateway) {
    };

    duplicateBusinessRules = async (businessRules: DuplicateBusinessRules): Promise<EntityInformation> =>
        this.api.post('/entities/duplicate/businessRule', toDuplicateBusinessRulesRequest(businessRules),
            {inType: DuplicateBusinessRulesRequest, outType: EntityInformation});

    duplicateMap = async(map: DuplicateMapsRule): Promise<EntityInformation> =>
        this.api.post('/entities/duplicate/map', toDuplicateMapRequest(map),
            {inType: DuplicateMapRequest, outType: EntityInformation});

    duplicatePlan = async (plan: DuplicatePlan): Promise<EntityInformation[]> =>
        this.api.postReturnArray('/entities/duplicate/plan', toDuplicatePlanRequest(plan),
            {inType: DuplicatePlanRequest, outType: EntityInformation});

    duplicateProduct = async (product: DuplicateProduct): Promise<EntityInformation[]> =>
        this.api.postReturnArray('/entities/duplicate/product', toDuplicateProductRequest(product),
            {inType: DuplicateProductRequest, outType: EntityInformation});

    duplicateTransaction = async (transaction: DuplicateTransaction): Promise<EntityInformation[]> =>
        this.api.postReturnArray('/entities/duplicate/transaction', toDuplicateTransactionRequest(transaction),
            {inType: DuplicateTransactionRequest, outType: EntityInformation});

}