import {Type} from 'class-transformer';
import Pageable from '../util/pageable';
import ConfigPackage from './configPackage';

export default class ConfigPackageList {
    @Type(() => ConfigPackage) public packages: ConfigPackage[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();

    static empty = (): ConfigPackageList => {
        return new ConfigPackageList();
    };

    hasNextPage = (): boolean => {
        return !this.page.isLast;
    };

    hasPreviousPage = (): boolean => {
        return !this.page.isFirst;
    };
}