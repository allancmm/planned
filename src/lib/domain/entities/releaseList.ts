import { Type } from 'class-transformer';
import Pageable from '../util/pageable';
import Release from './release';

export default class ReleaseList {
    @Type(() => Release) public releases: Release[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();
}
