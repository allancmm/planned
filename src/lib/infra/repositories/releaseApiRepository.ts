import { MigrationHistory } from '../../domain/entities/migrationHistory';
import Release from '../../domain/entities/release';
import ReleaseChecksum from '../../domain/entities/releaseChecksum';
import ReleaseList from '../../domain/entities/releaseList';
import VersionList from '../../domain/entities/versionList';
import ReleaseRepository from '../../domain/repositories/releaseRepository';
import LongJob from '../../domain/util/longJob';
import Pageable from '../../domain/util/pageable';
import * as ReleaseAssembler from '../assembler/releaseAssembler';
import { ApiGateway } from '../config/apiGateway';
import { HeaderType } from '../config/axiosApiGateway';
import {BuildIvsReleaseRequest} from '../request/buildIvsReleaseRequest';
import { BuildReleaseRequest, BuildCustomRequest, BuildTemplateRequest } from '../request/buildReleaseRequest';
import { DeployIvsReleaseRequest } from '../request/deployIvsReleaseRequest';
import Manifest from "../../domain/entities/manifest";

export default class ReleaseApiRepository implements ReleaseRepository {
    constructor(private api: ApiGateway) { }

    getReleaseList = async (releaseName: string, page: Pageable): Promise<ReleaseList> =>
        this.api.get(`/releases?releaseName=${releaseName}&pageNumber=${page.pageNumber}&size=${page.size}`, { outType: ReleaseList });

    buildTemplateRelease = async (request: BuildReleaseRequest): Promise<LongJob> => {
        return this.api.post(`/releases/template`, ReleaseAssembler.toBuildTemplateReleaseRequest(request), {
            inType: BuildTemplateRequest,
            outType: LongJob,
        });
    };

    buildCustomRelease = async (request: BuildReleaseRequest): Promise<LongJob> => {
        return this.api.post(`/releases/custom`, ReleaseAssembler.toBuildCustomReleaseRequest(request), {
            inType: BuildCustomRequest,
            outType: LongJob,
        });
    };

    buildMigrationSetRelease = async (request: BuildReleaseRequest): Promise<LongJob> => {
        return this.api.post(`/releases/migrationSets`, ReleaseAssembler.toBuildIvsReleaseRequest(request), {
            inType: BuildIvsReleaseRequest,
            outType: LongJob,
        });
    };

    deployIVSRelease = async (release: Release, target: string): Promise<LongJob> => {
        return this.api.post(
            `/releases/ivs/${release.releaseGuid}`,
            ReleaseAssembler.toDeployIvsReleaseRequest(target),
            {
                inType: DeployIvsReleaseRequest,
                outType: LongJob,
            },
        );
    };

    deployDetachedRelease = async (release: Release, target: string, path?: string): Promise<LongJob> => {
        return this.api.post(
            `/releases/${release.name}/deploy?targetEnvironmentId=${target}${path ? `&releasePath=${path}` : ''}`,
            null,
            {
                outType: LongJob,
            },
            'application/octet-stream' as HeaderType,
        );
    };

    getReleaseHistory = async (release: Release): Promise<MigrationHistory[]> => {
        return this.api.getArray(`releases/${release.releaseGuid}/history`, { outType: MigrationHistory });
    };

    getChecksum = async (release: Release): Promise<ReleaseChecksum> => {
        return this.api.get(`releases/checksum?releaseName=${release.name}`, { outType: ReleaseChecksum });
    };

    getVersionInRelease = async (release: Release): Promise<VersionList> => {
        return this.api.get(`releases/${release.releaseGuid}/versions`, { outType: VersionList });
    };

    getTemplateList = async (): Promise<string[]> => {
        return this.api.getArray('/releases/templates');
    };

    downloadRelease = async (pathName: string, releaseName: string) : Promise<any> => this.api.getBlobData(
            `/releases/artifact?path=${pathName}&releaseName=${releaseName}`);

    getManifest = async (release: Release): Promise<Manifest> =>
        this.api.get(`releases/${release.name}/manifest`, { outType: Manifest});
}
