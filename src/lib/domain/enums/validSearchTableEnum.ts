export interface ValidSearchTable {
    name: string;
    displayName: string;
}

export class ValidSearchTableEnum {
    constructor(public validSearchTables: ValidSearchTable[]) {}

    getEnumFromName = (name: string): ValidSearchTable => {
        const type = this.validSearchTables.find(validSearchTable => validSearchTable.name === name);
        return type ? type : { name, displayName: 'UNKNOWN' };
    };
}
