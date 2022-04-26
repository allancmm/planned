import { EntityLevel } from '../../../lib/domain/enums/entityLevel';

export interface FormEntityLevelLayout {
    [key: string]: FormEntityLevelElement;
}

interface FormEntityLevelElement {
    label: string;
    value: EntityLevel;
}

const entityLevelLayout: FormEntityLevelLayout = {
    '-': {
        label: 'Select Level',
        value: 'NONE',
    },
    POLICY: {
        label: 'Policy',
        value: 'POLICY',
    },
    PLAN: {
        label: 'Plan',
        value: 'PLAN',
    },
    CLIENT: {
        label: 'Client',
        value: 'CLIENT',
    },
    COMPANY: {
        label: 'Company',
        value: 'COMPANY',
    },
    INTAKE: {
        label: 'Data Intake',
        value: 'INTAKE',
    },
};

export default entityLevelLayout;
