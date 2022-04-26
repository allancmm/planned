import { Type } from 'class-transformer';
import Pageable from '../util/pageable';
import DebuggerEntity from './debuggerEntity';

export default class DebuggerEntityList {
    @Type(() => Pageable) public page: Pageable = new Pageable();
    @Type(() => DebuggerEntity) public responses: DebuggerEntity[] = [];
}
