import { Type } from 'class-transformer';
import Pageable from '../util/pageable';
import MigrationSet from './migrationSet';

export default class MigrationSetList {
    @Type(() => MigrationSet) public migrationSets: MigrationSet[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();

    static empty = (): MigrationSetList => {
        return new MigrationSetList();
    };

    hasNextPage = (): boolean => {
        return !this.page.isLast;
    };

    hasPreviousPage = (): boolean => {
        return !this.page.isFirst;
    };
}
