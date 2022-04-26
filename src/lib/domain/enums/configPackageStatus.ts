import {TypeCode, TypeCodeEnum} from './typeCodeEnum';

const ConfigPackageStatus: TypeCode[] = [
    { code: '01', value: 'Open' },
    { code: '02', value: 'Ready To Migrate' },
    { code: '03', value: ' Added For Migration' },
    { code: '04', value: 'Migrated' },
    { code: '05', value: 'Hold' },
    { code: '06', value: 'Rework Needed' },
    { code: '07', value: 'MigrationError' },
    { code: '08', value: 'Closed' },
    { code: '09', value: 'Accepted' },
    { code: '10', value: 'In Review' },
    { code: '11', value: 'Released' }
];

export const ConfigPackageStatusEnum = new TypeCodeEnum(ConfigPackageStatus);