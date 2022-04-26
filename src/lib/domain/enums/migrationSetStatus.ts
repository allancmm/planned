import { TypeCode, TypeCodeEnum } from './typeCodeEnum';

const MigrationSetStatus: TypeCode[] = [
    { code: '01', value: 'Ready To Migrate' },
    { code: '02', value: 'Migrated' },
    { code: '03', value: 'Migration - Error' },
    { code: '04', value: 'Closed' },
    { code: '05', value: 'Migration - Failed' },
    { code: '06', value: 'Released' },
    { code: '07', value: 'Reopened' },
];

export const MigrationSetStatusEnum = new TypeCodeEnum(MigrationSetStatus);
