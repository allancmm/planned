import { Type } from 'class-transformer';
import MigrationSet from './migrationSet';

export default class MigrationSetErrorPair {
    public errorMessage: string = '';
    @Type(() => MigrationSet) public migrationSet: MigrationSet = new MigrationSet();
}
