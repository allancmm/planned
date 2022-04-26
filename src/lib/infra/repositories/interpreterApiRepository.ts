import InterpreterResult from '../../domain/entities/interpreterResult';
import { EntityLevel } from '../../domain/enums/entityLevel';
import InterpreterRepository from '../../domain/repositories/interpreterRepository';
import * as InterpreterRequestAssembler from '../assembler/interpreterRequestAssembler';
import { ApiGateway } from '../config/apiGateway';
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

export default class InterpreterApiRepository implements InterpreterRepository {
    constructor(private api: ApiGateway) {}

    evaluateTransaction = async (
        entityLevel: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
        parameters: string,
        section: string,
    ): Promise<InterpreterResult> => {
        return this.api.post(
            `/interpreter/transactions`,
            InterpreterRequestAssembler.toTransactionRequest(entityLevel, entityGuid, ruleGuid, parameters, section),
            { inType: EvaluateTransactionRequest, outType: InterpreterResult },
        );
    };

    evaluateActivity = async (ruleGuid: string, section: string): Promise<InterpreterResult> => {
        return this.api.post(
            `/interpreter/activity`,
            InterpreterRequestAssembler.toActivityRequest(ruleGuid, section),
            {
                inType: EvaluateActivityRequest,
                outType: InterpreterResult,
            },
        );
    };

    evaluateFunctions = async (
        entityLevel: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
        parameters: string,
        section: string,
    ): Promise<InterpreterResult> => {
        return this.api.post(
            `/interpreter/functions`,
            InterpreterRequestAssembler.toFunctionsRequest(entityLevel, entityGuid, ruleGuid, parameters, section),
            { inType: EvaluateFunctionsRequest, outType: InterpreterResult },
        );
    };

    evaluateScreen = async (
        entityLevel: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
        parameters: string,
        section: string,
    ): Promise<InterpreterResult> => {
        return this.api.post(
            `/interpreter/screen`,
            InterpreterRequestAssembler.toScreenRequest(entityLevel, entityGuid, ruleGuid, parameters, section),
            { inType: EvaluateScreenRequest, outType: InterpreterResult },
        );
    };

    evaluateInquiryScreen = async (
        entityLevel: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
        parameters: string,
        section: string,
    ): Promise<InterpreterResult> => {
        return this.api.post(
            `/interpreter/inquiryScreen`,
            InterpreterRequestAssembler.toInquiryScreenRequest(entityLevel, entityGuid, ruleGuid, parameters, section),
            { inType: EvaluateInquiryScreenRequest, outType: InterpreterResult },
        );
    };

    evaluateFiles = async (ruleGuid: string, parameters: string): Promise<InterpreterResult> => {
        return this.api.post(`/interpreter/asFiles`, InterpreterRequestAssembler.toFilesRequest(ruleGuid, parameters), {
            inType: EvaluateFileRequest,
            outType: InterpreterResult,
        });
    };

    evaluateExposedComputations = async (ruleGuid: string, parameters: string): Promise<InterpreterResult> => {
        return this.api.post(
            `/interpreter/exposedComputations`,
            InterpreterRequestAssembler.toExposedComputationsRequest(ruleGuid, parameters),
            { inType: EvaluateExposedComputationsRequest, outType: InterpreterResult },
        );
    };

    evaluateCalculate = async (ruleGuid: string): Promise<InterpreterResult> => {
        return this.api.post(`/interpreter/calculate`, InterpreterRequestAssembler.toCalculateRequest(ruleGuid), {
            inType: EvaluateCalculateRequest,
            outType: InterpreterResult,
        });
    };

    evaluatePolicyValues = async (entityGuid: string, effectiveDate: Date): Promise<InterpreterResult> => {
        return this.api.post(
            `/interpreter/policyValues`,
            InterpreterRequestAssembler.toPolicyValuesRequest(entityGuid, effectiveDate),
            {
                inType: EvaluatePolicyValuesRequest,
                outType: InterpreterResult,
            },
        );
    };
}
