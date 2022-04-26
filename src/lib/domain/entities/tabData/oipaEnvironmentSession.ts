import { ITabData } from "./iTabData";
import { EntityType } from "../../enums/entityType";
import { OperationMode } from "../../enums/operationMode";
import Environment from "../environment";
import { Type } from "class-transformer";
import { Options } from "../../../../components/general/inputText";

export default class OipaEnvironmentSession extends ITabData {
    clazz: string = "OipaEnvironmentSession";

    @Type(() => Environment )
    public oipaEnvironment: Environment = new Environment();

    @Type(() => String )
    public operationMode: OperationMode = 'READ';

    @Type(() => Options)
    public optionsGitRepo: Options[] = [];

    constructor(oipaEnvironment: Environment, operationMode?: OperationMode) {
        super();
        this.oipaEnvironment = oipaEnvironment;
        this.operationMode = operationMode || 'READ';
    }

    generateTabId(): string {
        return `OipaEnvironmentSession - ${this.oipaEnvironment.identifier}`;
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return this.oipaEnvironment.displayName || 'Environment';
    }

    getType(): EntityType {
        return '';
    }

    getExtra(): string {
        return 'Oipa Environment';
    }
}