export default class EntityStatus {
    public static FIRST_REVISION_NUMBER: number = 0;
    public static UNKNOWN_LABEL: string = 'unknown';

    public status: ScmStatusType = 'unknown';
    public user: string = '';
    public readOnly: boolean = true;
    public versionNumber: number = EntityStatus.FIRST_REVISION_NUMBER;
    public lastModifiedBy: string = EntityStatus.UNKNOWN_LABEL;
    public lastModifiedGMT: string = EntityStatus.UNKNOWN_LABEL;
    public versionGuid : string = '';
}

export type ScmStatusType = 'checkIn' | 'checkOut' | 'checkedBy' | 'restricted' | 'unknown';
