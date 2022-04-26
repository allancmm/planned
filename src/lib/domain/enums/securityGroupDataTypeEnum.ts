import { SecurityGroupDataType } from './securityGroupDataType';

export interface SecurityGroupDataTypeProps {
    securityGroupDataType: SecurityGroupDataType;
    displayName: string;
    importableTab: boolean;
}

export class SecurityGroupDataTypeEnums {
    constructor(public securityGroupDataTypeProps: SecurityGroupDataTypeProps[]) {}

    getDisplayName = (securityGroupDataType: SecurityGroupDataType): string => {
        const type = this.securityGroupDataTypeProps.find(
            (sgdt) => sgdt.securityGroupDataType === securityGroupDataType,
        );
        return type ? type.displayName : '';
    };

    isImportableTab = (securityGroupDataType: SecurityGroupDataType): boolean => {
        const type = this.securityGroupDataTypeProps.find(
            (sgdt) => sgdt.securityGroupDataType === securityGroupDataType,
        );
        return type ? type.importableTab : false;
    };

    getType = (securityGroupDataType: string): SecurityGroupDataType => {
        const type = this.securityGroupDataTypeProps.find(
            (sgdt) => sgdt.securityGroupDataType.toString() === securityGroupDataType,
        );
        return type ? type.securityGroupDataType : '';
    };

    getAllTypes = (): SecurityGroupDataTypeProps[] => {
        return this.securityGroupDataTypeProps;
    };
}
