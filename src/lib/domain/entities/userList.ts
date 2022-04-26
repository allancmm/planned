import { Type } from 'class-transformer';
import Pageable from '../util/pageable';
import { User } from './user';

export default class UserList {
    @Type(() => User) public users: User[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();

    static empty = (): UserList => {
        return new UserList();
    };

    hasNextPage = (): boolean => {
        return !this.page.isLast();
    };

    hasPreviousPage = (): boolean => {
        return !this.page.isFirst();
    };
}
