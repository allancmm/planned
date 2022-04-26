import { Type } from 'class-transformer';
import { MigrationException } from './migrationException';

export class MigrationResponse {
    public name: string = '';
    public status: string = '';
    @Type(() => MigrationException) public failures: MigrationException[] = [];
    public log: string = '';
}
