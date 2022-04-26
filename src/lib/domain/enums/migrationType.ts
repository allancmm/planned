import {TypeCode, TypeCodeEnum} from "./typeCodeEnum";

export type MigrationType =
    | 'MIGRATION_SET'
    | 'RELEASE_ARTIFACT';

const Migration: TypeCode[] = [
    { code: '02', value: 'MIGRATION_SET', label: 'Allow deployment of migration sets' },
    { code: '04', value: 'RELEASE_ARTIFACT', label: 'Allow deployment of release artifact' }
];

export const MigrationTypeCode = new TypeCodeEnum(Migration);