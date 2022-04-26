import { TypeCodeEnum, TypeCode } from './typeCodeEnum';

const LocalCode: TypeCode[] = [
    { code: '00', value: 'English' },
    { code: '01', value: 'French' },
    { code: '02', value: 'Japanese' },
    { code: '03', value: 'Chinese' },
    { code: '04', value: 'Polish' },
    { code: '05', value: 'Spanish' },
    { code: '06', value: 'Arabic' },
    { code: '07', value: 'German' },
];

export const LocalCodeEnum = new TypeCodeEnum(LocalCode);
