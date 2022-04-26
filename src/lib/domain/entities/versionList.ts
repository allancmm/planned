import { Type } from 'class-transformer';
import Pageable from '../util/pageable';
import Version from './version';

export default class VersionList {
    @Type(() => Version) public versions: Version[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();
}
