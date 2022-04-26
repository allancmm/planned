import { Transform } from 'class-transformer';
import { convertDate } from '../../util/transform';

export class MigrationHistory {
    public migrationHistoryGuid: string = '';
    @Transform(convertDate) public migrationDate: Date = new Date();
    public migrationType: string = '';
    public source: string = '';
    public destination: string = '';
    public status: string = '';
    public attachedRelease: string = '';
    public logData: string = '';
}
