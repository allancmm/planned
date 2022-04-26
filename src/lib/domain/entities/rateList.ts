import {Type} from 'class-transformer';
import Pageable from '../util/pageable';
import Rate from './rate';

export default class RateList {
    @Type(() => Rate) public rates: Rate[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();

    static empty(): RateList {
        return new RateList();
    }

    hasNextPage(): boolean {
        return !this.page.isLast();
    }

    hasPreviousPage(): boolean {
        return !this.page.isFirst();
    }
}