import { OverrideTypeCodeEnum } from '../../../lib/domain/enums/overrideType';

const COMPANY = `01`;

export const OverrideEnumType = {
    GLOBAL: OverrideTypeCodeEnum.getEnumFromValue('Global'),
    PCOMPANY: OverrideTypeCodeEnum.getEnumFromValue('Primary Company'),
    SCOMPANY: OverrideTypeCodeEnum.getEnumFromValue('Subsidiary Company'),
    PRODUCT: OverrideTypeCodeEnum.getEnumFromValue('Product'),
    PLAN: OverrideTypeCodeEnum.getEnumFromValue('Plan'),
    TRANSACTION: OverrideTypeCodeEnum.getEnumFromValue('Transaction'),
    FUND: OverrideTypeCodeEnum.getEnumFromValue('Fund'),
    REQUIREMENT: OverrideTypeCodeEnum.getEnumFromValue('Requirement'),
    GROUP_CUSTOMER: OverrideTypeCodeEnum.getEnumFromValue('Group Customer'),
    PROGRAM_DEFINITION: OverrideTypeCodeEnum.getEnumFromValue('Program Definition'),
    COMPANY: OverrideTypeCodeEnum.getEnumFromValue('Company'),
    CLIENT: OverrideTypeCodeEnum.getEnumFromValue('Client'),
    POLICY: OverrideTypeCodeEnum.getEnumFromValue('Policy'),
    SEGMENT: OverrideTypeCodeEnum.getEnumFromValue('Segment'),
    ACTIVITY: OverrideTypeCodeEnum.getEnumFromValue('Activity'),
    BAD_GUID: OverrideTypeCodeEnum.getEnumFromValue('Bad Guid'),
}

export const getOverrideFromDisplayName = (displayName: string) : string =>  {
    for (const [key, element] of Object.entries(OverrideEnumType)) {
        if(element.value === displayName) return key;
    }
    return 'BAD_GUID';
}

export const getBasicEntity = (paramName: string) => {
    for (const [key, element] of Object.entries(OverrideEnumType)) {
        if (paramName === key) return { name: element.value, value: element.code }
    }

    return
}

export const getEnumKey = (code: string) => {
    if (code === COMPANY) return `COMPANY`
    
    for (const [key, element] of Object.entries(OverrideEnumType)) {
        if (element.code === code) return key
    }

    return
}