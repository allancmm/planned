import ManifestReleaseTemplate from "./manifestReleaseTemplate";
import ManifestReleaseHistory from "./manifestReleaseHistory";

import { Type } from "class-transformer";

export default class Manifest {
    oipaVersion = '';
    designVersion = '';
    releaseGuid = '';
    releaseName = '';
    releaseDescription = '';
    releaseType = '';
    buildDate = '';
    buildBy = '';
    sourceEnvironment = '';
    checksum = '';
    content: string[] = [];

    @Type(() => ManifestReleaseTemplate)
    releaseTemplate = new ManifestReleaseTemplate();

    @Type(() => ManifestReleaseHistory)
    history: ManifestReleaseHistory[] = [];

}