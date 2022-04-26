import { TypeCode, TypeCodeEnum } from './typeCodeEnum';

const GitResetTypes: TypeCode[] = [
    { code: 'SOFT', value: 'Soft: Leave working tree and index untouched' },
    { code: 'MIXED', value: 'Mixed: Leave working tree untouched, reset index' },
    { code: 'HARD', value: 'Hard: Reset working tree and index (discard all local changes)' },
];

export const GitResetType = new TypeCodeEnum(GitResetTypes);
