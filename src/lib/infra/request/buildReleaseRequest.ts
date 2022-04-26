import { immerable } from 'immer';
import EntityFilter from '../../domain/entities/entityFilter';
import { ReleaseType } from '../../domain/enums/releaseType';

export class BuildReleaseRequest {
    [immerable] = true;

    public sourceEnvironmentId: string = '';
    public name: string = '';
    public description: string = '';
    public releaseType: ReleaseType = 'ARTIFACT_OIPA';

    public releaseTemplate: string = '';
    public filters: EntityFilter = new EntityFilter();
}

export class BuildCustomRequest {
    public sourceEnvironmentId: string = '';
    public name: string = '';
    public description: string = '';
    public releaseType: string = '';

    public filterGuid: string = '';
    public filterType: 'COMPANY' | 'PRODUCT' | 'PLAN' | 'TRANSACTION' = 'COMPANY';
}

export class BuildTemplateRequest {
    public sourceEnvironmentId: string = '';
    public name: string = '';
    public description: string = '';
    public releaseType: string = '';

    public releaseTemplate: string = '';
}
