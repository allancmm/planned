export const VersionTypes = [
    { name: 'FOLDER', value: 'folder' },
    { name: 'NEWITEM', value: 'newItem' },
    { name: 'MODIFIEDITEM', value: 'modifiedItem' },
    { name: 'UNMODIFIEDITEM', value: 'unmodifiedItem' },
    { name: 'DELETEDITEM', value: 'deletedItem' },
    { name: 'DELETEDFOLDER', value: 'deletedFolder' },
    { name: 'DUMMY', value: 'dummy' },
] as const;

export type VersionType = typeof VersionTypes[number]['name'];
