import { TypeCodeEnum, TypeCode } from './typeCodeEnum';

const FieldTypeCode: TypeCode[] = [
    { code: '01', value: 'DATE' },
    { code: '02', value: 'TEXT' },
    { code: '02', value: 'COMBO' },
    { code: '03', value: 'INTEGER' },
    { code: '04', value: 'FLOAT' },
    { code: '04', value: 'DECIMAL' },
    { code: '05', value: 'XMLDATA' },
];

export const FieldTypeCodeEnum = new TypeCodeEnum(FieldTypeCode);
