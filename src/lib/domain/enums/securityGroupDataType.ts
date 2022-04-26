import { SecurityGroupDataTypeEnums, SecurityGroupDataTypeProps } from './securityGroupDataTypeEnum';

export type SecurityGroupDataType =
    | 'ALL'
    | 'USER'
    | 'COMPANY'
    | 'COMPANY_PAGE'
    | 'PARENT_PLAN'
    | 'PRODUCT'
    | 'PRODUCT_TRANSACTION'
    | 'PLAN'
    | 'PLAN_TRANSACTION'
    | 'INQUIRY_SCREEN'
    | 'MASK'
    | 'FIELD'
    | 'WEB_SERVICE'
    | 'ERROR'
    | '';

const securityGroupDataTypes: SecurityGroupDataTypeProps[] = [
    { securityGroupDataType: 'ALL', displayName: 'All', importableTab: true },
    { securityGroupDataType: 'USER', displayName: 'User', importableTab: false },
    { securityGroupDataType: 'COMPANY', displayName: 'Company', importableTab: false },
    { securityGroupDataType: 'COMPANY_PAGE', displayName: 'Company Page', importableTab: true },
    { securityGroupDataType: 'PARENT_PLAN', displayName: 'Parent Plan', importableTab: true },
    { securityGroupDataType: 'PRODUCT', displayName: 'Product', importableTab: true },
    { securityGroupDataType: 'PRODUCT_TRANSACTION', displayName: 'Product Transaction', importableTab: true },
    { securityGroupDataType: 'PLAN', displayName: 'Plan', importableTab: true },
    { securityGroupDataType: 'PLAN_TRANSACTION', displayName: 'Plan Transaction', importableTab: true },
    { securityGroupDataType: 'INQUIRY_SCREEN', displayName: 'Inquiry Screen', importableTab: true },
    { securityGroupDataType: 'MASK', displayName: 'Mask', importableTab: true },
    { securityGroupDataType: 'FIELD', displayName: 'Field', importableTab: true },
    { securityGroupDataType: 'WEB_SERVICE', displayName: 'Web Service', importableTab: true },
    { securityGroupDataType: 'ERROR', displayName: 'Error', importableTab: true },
];

export const SecurityGroupDataTypeEnum = new SecurityGroupDataTypeEnums(securityGroupDataTypes);
