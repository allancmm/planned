import { TypeCode, TypeCodeEnum } from './typeCodeEnum';

const CriterionCode: TypeCode[] = [
    { code: '01', value: 'Date Value' },
    { code: '02', value: 'Text Value' },
    { code: '03', value: 'Int Value' },
    { code: '04', value: 'Float Value' },
    { code: '05', value: 'Money Value' },
];

export const CriterionCodeEnum = new TypeCodeEnum(CriterionCode);