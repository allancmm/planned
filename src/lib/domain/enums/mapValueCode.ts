import { TypeCode, TypeCodeEnum } from './typeCodeEnum';

const MapCode: TypeCode[] = [
    { code: '01', value: 'Date Value' },
    { code: '02', value: 'Text Value' },
    { code: '03', value: 'Int Value' },
    { code: '04', value: 'Float Value' },
];

export const MapCodeEnum = new TypeCodeEnum(MapCode);
