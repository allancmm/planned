
export class DuplicateEntity {
    public overrideTypeCode = '';
    public overrideLevel = '';
    public overrideGuid = '';
    public sourceEntityGuid = '';
    public typeCode = '';
    public newEntityName = '';

    constructor(overrideTypeCode: string, sourceEntityGuid: string, typeCode?: string, newEntityName?: string) {
        this.overrideTypeCode = overrideTypeCode;
        this.sourceEntityGuid = sourceEntityGuid;
        this.typeCode = typeCode ?? '';
        this.newEntityName = newEntityName ?? '';
    }
}