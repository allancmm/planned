import { TypeCodeEnum, TypeCode } from './typeCodeEnum';

export const OverrideCode: TypeCode[] = [
    { code: '00', value: 'Global' },
    { code: '01', value: 'Company' }, // Is not used for General Component
    { code: '101', value: 'Primary Company' }, // Added for General Component
    { code: '201', value: 'Subsidiary Company' }, // Added for General Component
    { code: '02', value: 'Transaction' },
    { code: '03', value: 'Plan' },
    { code: '04', value: 'Product' },
    { code: '05', value: 'Fund' },
    { code: '06', value: 'Client' }, // Not used for override
    { code: '07', value: 'Policy' }, // Not used for override
    { code: '08', value: 'Segment' }, // Not used for override
    { code: '09', value: 'Activity' }, // Not used for override
    { code: '10', value: 'Requirement' }, 
    { code: '11', value: 'Group Customer' },
    { code: '12', value: 'Program Definition' },
    { code: '-1', value: 'Bad Guid'}
];

export const OverrideTypeCodeEnum = new TypeCodeEnum(OverrideCode);
