import { TypeCode, TypeCodeEnum } from './typeCodeEnum';

const LocalCode: TypeCode[] = [
    { code: '00', value: 'UNDEFINED' },
    { code: '01', value: 'MIGRATION_SET' },
    { code: '03', value: 'RIP' },
    { code: '04', value: 'ARTIFACT_OIPA' },
    { code: '05', value: 'CUSTOM' },
    { code: '06', value: 'ARTIFACT_GIT' },
    { code: '07', value: 'Artifact - GIT(DIFF)' },
];

export const isDetached = (code: string): boolean => {
    const type = ReleaseTypeCodeEnum.getEnumFromCode(code).value as ReleaseType;
    return !!DetachedReleaseTypes.find((e) => e === type);
};

export const isCustomRelease = (type: ReleaseType): boolean => {
    return !!CustomReleaseType.find((e) => e === type);
};

export const isMigrationSetRelease = (type: ReleaseType): boolean => {
    return !!MigrationSetType.find((e) => e === type);
};

export const OtherReleaseTypes = ['UNDEFINED', 'MIGRATION_SET', 'RIP'] as const;
export const MigrationSetType = ['MIGRATION_SET'] as const;
export const CustomReleaseType = ['CUSTOM'] as const;
export const DetachedReleaseTypes = ['ARTIFACT_OIPA', 'CUSTOM', 'ARTIFACT_GIT', 'MIGRATION_SET' , 'Artifact - GIT(DIFF)'] as const;
export type OtherReleaseType = typeof OtherReleaseTypes[number];
export type DetachedReleaseType = typeof DetachedReleaseTypes[number];

export type ReleaseType = OtherReleaseType | DetachedReleaseType;
export const ReleaseTypeCodeEnum = new TypeCodeEnum(LocalCode);


