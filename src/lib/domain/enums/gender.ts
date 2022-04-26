import { TypeCodeEnum, TypeCode } from './typeCodeEnum';

const Gender: TypeCode[] = [{ code: '01', value: 'Male' }, { code: '02', value: 'Female' }];

export const GenderEnum = new TypeCodeEnum(Gender);
