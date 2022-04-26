import { MigrationHistory } from '../domain/entities/migrationHistory';
import Release from '../domain/entities/release';
import ReleaseChecksum from '../domain/entities/releaseChecksum';
import ReleaseList from '../domain/entities/releaseList';
import VersionList from '../domain/entities/versionList';
import {isCustomRelease, isDetached, isMigrationSetRelease} from '../domain/enums/releaseType';
import ReleaseRepository from '../domain/repositories/releaseRepository';
import LongJob from '../domain/util/longJob';
import Pageable from '../domain/util/pageable';
import { BuildReleaseRequest } from '../infra/request/buildReleaseRequest';
import Manifest from "../domain/entities/manifest";

export default class ReleaseService {
    constructor(private releaseRepository: ReleaseRepository) {}

    getReleaseList = async (releaseName: string, page: Pageable): Promise<ReleaseList> =>
        this.releaseRepository.getReleaseList(releaseName, page);

    buildRelease = async (request: BuildReleaseRequest): Promise<LongJob> => {
        return isMigrationSetRelease(request.releaseType) ? this.releaseRepository.buildMigrationSetRelease(request) :
            isCustomRelease(request.releaseType) ? this.releaseRepository.buildCustomRelease(request) : this.releaseRepository.buildTemplateRelease(request);
    };

    deployRelease = async (release: Release, target: string, path?: string): Promise<LongJob> => {
        return isDetached(release.type)
            ? this.releaseRepository.deployDetachedRelease(release, target, path)
            : this.releaseRepository.deployIVSRelease(release, target);
    };

    getReleaseHistory = async (release: Release): Promise<MigrationHistory[]> => {
        return this.releaseRepository.getReleaseHistory(release);
    };

    getChecksum = async (release: Release): Promise<ReleaseChecksum> => {
        return this.releaseRepository.getChecksum(release);
    };

    getVersionInRelease = async (release: Release): Promise<VersionList> => {
        return this.releaseRepository.getVersionInRelease(release);
    };

    downloadRelease = (pathName: string, releaseName: string): Promise<any> =>
        this.releaseRepository.downloadRelease(pathName, releaseName);

    getTemplateList = async () => {
        return this.releaseRepository.getTemplateList();
    };

    getManifest = async (release: Release) : Promise<Manifest> =>
        this.releaseRepository.getManifest(release);
}
