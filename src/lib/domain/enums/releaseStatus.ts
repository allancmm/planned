import { TypeCodeEnum, TypeCode } from './typeCodeEnum';

const LocalCode: TypeCode[] = [
    { code: '02', value: 'READY_TO_RELEASE' },
    { code: '03', value: 'RELEASED' },
    { code: '04', value: 'RELEASED_ERRORS' },
    { code: '05', value: 'INVALID_RELEASE_ARTIFACT' },
    { code: '07', value: 'DETACHED' },
];

export const ReleaseStatusCodeEnum = new TypeCodeEnum(LocalCode);
