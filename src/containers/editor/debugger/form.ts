import { EntityLevel } from '../../../lib/domain/enums/entityLevel';
import { EntityType } from '../../../lib/domain/enums/entityType';

interface FormLayout {
    [key: string]: FormElement;
}
interface FormElement {
    label: string;
    value: EntityType;

    entityLevels: EntityLevel[];
    hasParameters?: boolean;
}

const formLayout: FormLayout = {
    '-': {
        label: 'Select One',
        value: '',
        entityLevels: [],
    },
    ACTIVITY: {
        label: 'Activity',
        value: 'ACTIVITY',
        entityLevels: ['APPLICATION', 'POLICY', 'PLAN', 'CLIENT', 'COMPANY'],
    },
    TRANSACTIONS: {
        label: 'Transaction',
        value: 'TRANSACTIONS',
        entityLevels: ['APPLICATION', 'POLICY', 'PLAN', 'CLIENT', 'COMPANY', 'DATAFILE'],
        hasParameters: true,
    },
    FUNCTIONS: {
        label: 'Function',
        value: 'FUNCTIONS',
        entityLevels: ['APPLICATION', 'POLICY', 'PLAN', 'CLIENT', 'COMPANY', 'DATAFILE', 'NONE'],
        hasParameters: true,
    },
    AS_FILE: {
        label: 'File',
        value: 'AS_FILE',
        entityLevels: ['COMPANY', 'NONE'],
        hasParameters: true,
    },
    EXPOSED_COMPUTATION: {
        label: 'Exposed Computation',
        value: 'EXPOSED_COMPUTATION',
        entityLevels: ['NONE'],
        hasParameters: true,
    },
    INQUIRY_SCREEN: {
        label: 'Inquiry Screen',
        value: 'INQUIRY_SCREEN',
        entityLevels: ['APPLICATION', 'POLICY', 'CLIENT', 'MAIN_MENU'],
        hasParameters: true,
    },
    SCREEN: {
        label: 'Screen',
        value: 'SCREEN',
        entityLevels: ['APPLICATION', 'POLICY'],
        hasParameters: true,
    },
    CALCULATE: {
        label: 'Calculate',
        value: 'CALCULATE',
        entityLevels: ['APPLICATION', 'POLICY'],
    },
    POLICY_VALUE: {
        label: 'Policy value',
        value: 'POLICY_VALUE',
        entityLevels: ['APPLICATION', 'POLICY'],
    },
};

export default formLayout;
