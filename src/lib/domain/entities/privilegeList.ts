import {Type} from 'class-transformer';
import Privilege from './privilege';

export default class PrivilegeList {
    @Type(() => Privilege) public privileges : Privilege[] = [];

    static empty(): PrivilegeList {
        return new PrivilegeList();
    }
}