import { BuildReleaseRequest } from '../../infra/request/buildReleaseRequest';
import { MigrationHistory } from '../entities/migrationHistory';
import Release from '../entities/release';
import ReleaseChecksum from '../entities/releaseChecksum';
import ReleaseList from '../entities/releaseList';
import VersionList from '../entities/versionList';
import LongJob from '../util/longJob';
import Pageable from '../util/pageable';
import Manifest from "../entities/manifest";

export default interface ReleaseRepository {
    getReleaseList(releaseName: string, page: Pageable): Promise<ReleaseList>;

    buildTemplateRelease(request: BuildReleaseRequest): Promise<LongJob>;

    buildCustomRelease(request: BuildReleaseRequest): Promise<LongJob>;

    buildMigrationSetRelease(request: BuildReleaseRequest): Promise<LongJob>;

    deployIVSRelease(release: Release, target: string): Promise<LongJob>;

    deployDetachedRelease(release: Release, target: string, path?: string): Promise<LongJob>;

    getReleaseHistory(release: Release): Promise<MigrationHistory[]>;

    getChecksum(release: Release): Promise<ReleaseChecksum>;

    getVersionInRelease(release: Release): Promise<VersionList>;

    downloadRelease(pathName: string, releaseName: string): Promise<any>;

    getTemplateList(): Promise<string[]>;

    getManifest(release: Release): Promise<Manifest>;
}
