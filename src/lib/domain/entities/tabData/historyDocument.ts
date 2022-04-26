import { Transform, Type } from 'class-transformer';
import { convertDictionary } from '../../../util/transform';
import { EntityType } from '../../enums/entityType';
import { FileType } from '../../enums/fileType';
import EntityStatus from '../entityStatus';
import Environment from '../environment';
import Version from '../version';
import { ITabData } from './iTabData';

export default class HistoryDocument extends ITabData {
    clazz: string = 'HistoryDocument';

    public ruleGuid: string = '';
    public ruleName: string = '';
    public entityType: EntityType = '';
    public fileType: FileType = 'DEFAULT';
    public linkedFiles: FileType[] = [];

    @Type(() => Environment)
    public leftEnv: Environment;
    @Type(() => Environment)
    public rightEnv: Environment;

    @Type(() => Version)
    public leftVersion?: Version;
    @Type(() => Version)
    public rightVersion?: Version;

    public leftXml?: string;
    public rightXml?: string;

    @Transform(convertDictionary(Version, {}, true))
    public versionsByEnv: { [envId: string]: Version[] } = {};

    constructor(
        ruleGuid: string,
        ruleName: string,
        entityType: EntityType,
        fileType: FileType,
        env: Environment,
        originalStatus?: EntityStatus,
    ) {
        super();
        this.ruleGuid = ruleGuid;
        this.ruleName = ruleName;
        this.entityType = entityType;
        this.fileType = fileType;

        this.leftEnv = env;
        this.rightEnv = env;

        if (originalStatus) {
            this.status = originalStatus;
        }
    }

    generateTabId(): string {
        return `${this.ruleGuid} - ${this.fileType} - History`;
    }
    getGuid(): string {
        return `${this.ruleGuid} - ${this.fileType} - History`;
    }
    getName(): string {
        return `${this.ruleName} - ${this.fileType} - History`;
    }
    getType(): EntityType {
        return this.entityType;
    }
    getExtra(): string {
        return 'History';
    }
    getLabelExtension(): string {
        return ` - History`;
    }
}
