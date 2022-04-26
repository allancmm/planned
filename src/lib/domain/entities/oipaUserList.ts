import OipaUser from './oipaUser';
import Pageable from '../util/pageable';
import { Type } from 'class-transformer';

export default class OipaUserList {
    @Type(() => OipaUser) public users: OipaUser[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();
}
