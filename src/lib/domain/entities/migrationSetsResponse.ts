import { Type } from 'class-transformer';
import { MigrationResponse } from './migrationResponse';
import MigrationSetErrorPair from './migrationSetErrorPair';

export default class MigrationSetsResponse {
    @Type(() => MigrationResponse) public migrationResponses: MigrationResponse[] = [];
    @Type(() => MigrationSetErrorPair) public migrationErrors: MigrationSetErrorPair[] = [];
    @Type(() => MigrationSetErrorPair) public connectionFailedErrors: MigrationSetErrorPair[] = [];
}
