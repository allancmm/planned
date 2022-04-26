import DebuggerForm from '../domain/entities/debuggerForm';
import InterpreterResult from '../domain/entities/interpreterResult';
import InterpreterRepository from '../domain/repositories/interpreterRepository';

export default class InterpreterService {
    constructor(private interpreterRepository: InterpreterRepository) {}

    interpretRule = async (form: DebuggerForm, parameters: string): Promise<InterpreterResult> => {
        switch (form.entityType) {
            case 'TRANSACTIONS': {
                return this.interpreterRepository.evaluateTransaction(
                    form.entityLevel,
                    form.entity?.guid ?? '',
                    form.ruleGuid,
                    parameters,
                    form.params.section,
                );
            }
            case 'ACTIVITY': {
                return this.interpreterRepository.evaluateActivity(form.ruleGuid, form.params.section);
            }
            case 'FUNCTIONS': {
                return this.interpreterRepository.evaluateFunctions(
                    form.entityLevel,
                    form.entity?.guid ?? '',
                    form.ruleGuid,
                    parameters,
                    form.params.section,
                );
            }
            case 'SCREEN': {
                return this.interpreterRepository.evaluateScreen(
                    form.entityLevel,
                    form.entity?.guid ?? '',
                    form.ruleGuid,
                    parameters,
                    form.params.section,
                );
            }
            case 'INQUIRY_SCREEN': {
                return this.interpreterRepository.evaluateInquiryScreen(
                    form.entityLevel,
                    form.entity?.guid ?? '',
                    form.ruleGuid,
                    parameters,
                    form.params.section,
                );
            }
            case 'AS_FILE': {
                return this.interpreterRepository.evaluateFiles(form.ruleGuid, parameters);
            }
            case 'EXPOSED_COMPUTATION': {
                return this.interpreterRepository.evaluateExposedComputations(form.ruleGuid, parameters);
            }
            case 'CALCULATE': {
                return this.interpreterRepository.evaluateCalculate(form.ruleGuid);
            }
            case 'POLICY_VALUE': {
                return this.interpreterRepository.evaluatePolicyValues(form.entity?.guid ?? '', form.effectiveDate);
            }
        }
        const res = new InterpreterResult();
        res.combinedDocument = 'TODO: others';
        res.xmlResult = 'TODO: others';
        res.errorDocument = 'TODO: others';
        return Promise.resolve(res);
    };
}
