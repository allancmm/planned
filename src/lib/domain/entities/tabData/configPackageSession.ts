import { Type } from 'class-transformer';
import ConfigPackageContent from '../../configPackageContent';
import { EntityType } from '../../enums/entityType';
import ConfigPackage from '../configPackage';
import ReviewComment from '../reviewComment';
import { ITabData } from './iTabData';

export default class ConfigPackageSession extends ITabData {
    clazz: string = 'ConfigPackageSession';

    public configPackageGuid: string = '';
    public configPackageName: string = '';

    @Type(() => ConfigPackage)
    public pkg: ConfigPackage = new ConfigPackage();

    @Type(() => ReviewComment)
    public comments: ReviewComment[] = [];

    public pkgContent: ConfigPackageContent[] = [];
    public currentPkgContent?: ConfigPackageContent;

    public editMode = false;

    generateTabId(): string {
        return this.configPackageGuid;
    }

    getGuid(): string {
        return this.configPackageGuid;
    }

    getName(): string {
        return this.configPackageName;
    }

    getType(): EntityType {
        return 'DOCUMENT';
    }

    getExtra(): string {
        return `ConfigPackage - ${this.pkg.packageName}`;
    }
}
