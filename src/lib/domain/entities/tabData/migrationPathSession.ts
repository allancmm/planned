import { ITabData } from "./iTabData";
import { EntityType } from "../../enums/entityType";
import { OperationMode } from "../../enums/operationMode";
import { Type } from "class-transformer";
import { MigrationPath } from "../migrationPath";
import { Options } from "../../../../components/general/inputText";

export default class MigrationPathSession extends ITabData {
    clazz: string = "MigrationPathSession";

    @Type(() => MigrationPath )
    public migrationPath: MigrationPath = new MigrationPath();

    @Type(() => String )
    public operationMode: OperationMode = 'READ';

    @Type(() => Options )
    sourceEnvironmentsOptions: Options[] = [];

    @Type(() => Options )
    targetEnvironmentsOptions: Options[] = [];

    constructor(migrationPath: MigrationPath, operationMode: OperationMode) {
        super();
        this.migrationPath = migrationPath;
        this.operationMode = operationMode;
    }

    generateTabId(): string {
        return `MigrationPathSession - ${this.migrationPath.identifier}`;
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return this.migrationPath.displayName || 'Migration Path';
    }

    getType(): EntityType {
        return '';
    }

    getExtra(): string {
        return 'Migration Path';
    }
}