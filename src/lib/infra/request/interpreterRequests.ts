import { EntityLevel } from '../../domain/enums/entityLevel';

class EvaluateRequest {
    public entityLevel: EntityLevel = 'NONE';
    public entityGuid: string = '';

    public parameters: string = '';
    public section: string = '';
}

export class EvaluateFileRequest {
    public asFileGuid: string = '';
    public requestFile: string = '';
}

export class EvaluateActivityRequest {
    public activityGuid: string = '';
    public section: string = '';
}

export class EvaluateExposedComputationsRequest {
    public entityGuid: string = '';
    public requestFile: string = '';
}

export class EvaluateCalculateRequest {
    public segmentGuid: string = '';
}

export class EvaluateTransactionRequest extends EvaluateRequest {
    public transactionGuid: string = '';
}

export class EvaluateFunctionsRequest extends EvaluateRequest {
    public businessRuleGuid: string = '';
}

export class EvaluateScreenRequest extends EvaluateRequest {
    public businessRuleGuid: string = '';
}

export class EvaluateInquiryScreenRequest extends EvaluateRequest {
    public inquiryScreenGuid: string = '';
}

export class EvaluatePolicyValuesRequest {
    public policyGuid: string = '';
    public effectiveDate: Date = new Date();
}
