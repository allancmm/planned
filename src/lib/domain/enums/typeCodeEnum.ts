export interface TypeCode {
    code: string;
    value: string;
    label?: string;
}

export class TypeCodeEnum {
    constructor(public codes: TypeCode[]) {}

    getEnumFromCode = (code: string): TypeCode => {
        const type = this.codes.find((typeCode) => typeCode.code === code);
        return type ? type : { code, value: 'UNKNOWN' };
    };

    getEnumFromValue = (value: string): TypeCode => {
        const type = this.codes.find((typeCode) => typeCode.value === value);
        return type ? type : { code: value, value: 'UNKNOWN' };
    };
}
