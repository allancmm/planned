import { TypeCode, TypeCodeEnum } from "./typeCodeEnum";

export const validEntityTypePageSecurity : TypeCode[] = [
    { code: 'TRANSACTIONS', value: 'Transactions' },
    { code: 'PLAN', value: 'Plan' },
    { code: 'INQUIRY_SCREEN', value: 'Inquiry Screen' },
    { code: 'PRODUCT', value: 'Product' },
    { code: 'COMPANY', value: 'Company' }
];

export const EntityTypePageSecurityEnum = new TypeCodeEnum(validEntityTypePageSecurity);

export const entitiesAuthSecurity = ['BUSINESS_RULES', 'TRANSACTIONS'];

export type AuthSecurityType = 'maskSecurityData' | 'fieldSecurityData';