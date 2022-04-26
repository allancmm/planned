export class DuplicateBusinessRulesRequest {
    public overrideLevel: string = '';
    public overrideGuid: string = '';
    public newBusinessRuleName: string = '';
    public sourceBusinessRuleGuid: string = '';
    public createCheckedOut: boolean = false;
    public stateCode?: string;
    public systemCode?: string;
}
export class DuplicateMapRequest {
    public newMapName: string = '';
    public sourceMapGuid: string = '';
    public createCheckedOut: boolean = false;
}
export class DuplicatePlanRequest {
    public overrideLevel: string = '';
    public overrideGuid: string = '';
    public newPlanName: string = '';
    public newEffectiveDate?: Date;
    public newExpirationDate?: Date;
    public sourcePlanGuid: string = '';
    public createCheckedOut: boolean = false;
    public copyAllRules: boolean = false;
}

export class DuplicateProductRequest {
    public overrideLevel: string = '';
    public overrideGuid: string = '';
    public newProductName: string = '';
    public description?: string;
    public newEffectiveDate?: Date;
    public newExpirationDate?: Date;
    public sourceProductGuid: string = '';
    public createCheckedOut: boolean = false;
    public copyAllRules: boolean = false;
}

export class DuplicateTransactionRequest {
    public overrideLevel: string = '';
    public overrideGuid: string = '';
    public sourceTransactionGuid: string = '';
    public newTransactionName: string = '';
    public createCheckedOut: boolean = false;
}
