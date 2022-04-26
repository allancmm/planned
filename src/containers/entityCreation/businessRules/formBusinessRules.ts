import { BusinessRuleTypeCode } from '../../../lib/domain/enums/businessRuleTypeCode';

export interface FormLayout {
    [key: string]: FormElement;
}

interface FormElement {
    label: string;
    value: BusinessRuleTypeCode;
    code: string;
}

const formlayout: FormLayout = {
    '-': {
        label: 'Select One',
        value: '',
        code: ''
    },
    SYSTEM: {
        label: 'System',
        value: 'SYSTEM', 
        code: '01'
    },
    COPYBOOK: {
        label: 'CopyBook',
        value: 'COPYBOOK',
        code: '04'
    },
    FUNCTION: {
        label: 'Function',
        value: 'FUNCTION',
        code: '05'
    },
    MULTIFIELD: {
        label: 'MultiField',
        value: 'MULTIFIELD',
        code: '06'
    },
    SCREEN: {
        label: 'Screen',
        value: 'SCREEN',
        code: '07'
    },
    EXPOSED_COMPUTATION: {
        label: 'Exposed Computation',
        value: 'EXPOSED_COMPUTATION',
        code: '08'
    },
    ATTACHED_RULE: {
        label: 'Attached Rule',
        value: 'ATTACHED_RULE',
        code: '10'
    },
    PLAN_RULE: {
        label: 'Plan Rule',
        value: 'PLAN_RULE',
        code: '12'
    },
    CALCULATE: {
        label: 'Calculate',
        value: 'CALCULATE',
        code: '13'
    },
    COMPUTATION: {
        label: 'Computation',
        value: 'COMPUTATION',
        code: '09'
    },
    WIDGET: {
        label: 'Widget',
        value: 'WIDGET',
        code: '15'
    }
};
 export default formlayout;