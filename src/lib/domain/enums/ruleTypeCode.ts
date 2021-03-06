import { TypeCode, TypeCodeEnum } from './typeCodeEnum';

const RuleTypeCode: TypeCode[] = [
    { code: '01', value: 'Business Rule' },
    { code: '02', value: 'Transaction' },
    { code: '03', value: 'Segment Name' },
    { code: '04', value: 'Security Role' },
    { code: '05', value: 'Inquiry Screen' },
    { code: '06', value: 'File' },
    { code: '07', value: 'BatchScreen' },
    { code: '08', value: 'Map' },
    { code: '09', value: 'Code' },
    { code: '10', value: 'Country' },
    { code: '11', value: 'Rate' },
    { code: '12', value: 'Chart of Accounts' },
    { code: '13', value: 'Plan' },
    { code: '14', value: 'Requirement' },
    { code: '15', value: 'Exposed Computation' },
    { code: '16', value: 'Currency' },
    { code: '17', value: 'Market Maker' },
    { code: '18', value: 'Error Catalog' },
    { code: '20', value: 'Fund Class' },
    { code: '26', value: 'Mask' },
    { code: '27', value: 'Plan State Approval' },
    { code: '28', value: 'Segment State Approval' },
    { code: '29', value: 'Comment Template' },
    { code: '32', value: 'Program Definition' },
    { code: '33', value: 'Plan Program Definition' },
    { code: '34', value: 'Segment Program Definition' },
    { code: '35', value: 'Filter' },
    { code: '40', value: 'Agreement Definition' },
    { code: '41', value: 'Intake Profile' },
    { code: '50', value: 'File Output' },
    { code: '52', value: 'Sequence' },
    { code: 'C1', value: 'Asset Class' },
    { code: 'C2', value: 'Asset Class Fund Versions' },
    { code: 'C3', value: 'Asset Class Fund' },
    { code: 'F0', value: 'Fund' },
    { code: 'F1', value: 'Fund Relation' },
    { code: 'F2', value: 'Plan Fund Versions' },
    { code: 'F3', value: 'Plan Fund' },
    { code: 'F4', value: 'Plan Fund Status Versions' },
    { code: 'F5', value: 'Plan Fund Status' },
    { code: 'M0', value: 'Model Definition' },
    { code: 'M1', value: 'Model' },
    { code: 'M2', value: 'Model Asset Class' },
    { code: 'M3', value: 'Model Asset Class Fund' },
    { code: 'M4', value: 'Model Fund' },
    { code: 'M5', value: 'NA' },
    { code: 'M6', value: 'Plan Model Definition' },
    { code: 'M7', value: 'Plan Model Definition Status' },
    { code: 'P0', value: 'Product Fund Versions' },
    { code: 'P1', value: 'Product Fund' },
    { code: 'WQ', value: 'Workflow Queue Role' },
    { code: 'WT', value: 'Workflow Task Definition' },
];

export const RuleTypeCodeEnum = new TypeCodeEnum(RuleTypeCode);
