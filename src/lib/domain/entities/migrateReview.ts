import OipaRule from './oipaRule';

export type VersionConflictStatus = 'OK' | 'CONFLICT' | 'WARNING';

export default class MigrateReview {
    public versionGuid: string = '';
    public rule: OipaRule = new OipaRule();

    public versionInPackage: number = 0;
    public versionInTarget: number = 0;

    public fromConfigPackageName: string = '';
    public fromMigrationSetName: string = '';

    public status: VersionConflictStatus = 'OK';
}
