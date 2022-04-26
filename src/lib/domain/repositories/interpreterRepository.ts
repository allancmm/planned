import InterpreterResult from '../entities/interpreterResult';
import { EntityLevel } from '../enums/entityLevel';

export default interface InterpreterRepository {
    evaluateTransaction(
        entityLevel: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
        parameters: string,
        section: string,
    ): Promise<InterpreterResult>;

    evaluateActivity(ruleGuid: string, section: string): Promise<InterpreterResult>;

    evaluateFunctions(
        entityLevel: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
        parameters: string,
        section: string,
    ): Promise<InterpreterResult>;

    evaluateScreen(
        entityLevel: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
        parameters: string,
        section: string,
    ): Promise<InterpreterResult>;

    evaluateInquiryScreen(
        entityLevel: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
        parameters: string,
        section: string,
    ): Promise<InterpreterResult>;

    evaluateFiles(ruleGuid: string, parameters: string): Promise<InterpreterResult>;

    evaluateExposedComputations(ruleGuid: string, parameters: string): Promise<InterpreterResult>;

    evaluateCalculate(ruleGuid: string): Promise<InterpreterResult>;

    evaluatePolicyValues(entityGuid: string, effectiveDate: Date): Promise<InterpreterResult>;
}
