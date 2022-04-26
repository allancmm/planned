import { Type } from 'class-transformer';
import Pageable from '../util/pageable';
import { MigrationHistory } from './migrationHistory';

export default class MigrationHistoryList {
    @Type(() => MigrationHistory) public histories: MigrationHistory[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();

    static empty = (): MigrationHistoryList => {
        return new MigrationHistoryList();
    };

    hasNextPage = (): boolean => {
        return !this.page.isLast;
    };

    hasPreviousPage = (): boolean => {
        return !this.page.isFirst;
    };
}
