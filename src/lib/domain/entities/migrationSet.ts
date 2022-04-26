import { Transform, Type } from 'class-transformer';
import {immerable} from 'immer';
import { convertDate } from '../../util/transform';
import { MigrationHistory } from './migrationHistory';

export default class MigrationSet {
    [immerable] = true;

    public migrationSetGuid: string = '';
    public migrationSetName: string = '';
    public lastModifiedBy: string = '';
    @Transform(convertDate) public lastModifiedAt: Date = new Date();
    public status: string = '';
    public comments: string = '';
    public creationEnv: string = '';

    public environments: string[] = [];
    @Type(() => MigrationHistory) public migrationHistory: MigrationHistory[] = [];

    public configPackagesGuids: string[] = [];

    isReadyToMigrate = (): boolean => {
        return this.status === '01';
    };
}
