import ConfigPackage from '../../domain/entities/configPackage';
import Version from '../../domain/entities/version';
import { ConfigPackageCreationRequest } from '../request/configPackageCreationRequest';

export const toConfigPackageCreationRequest = (configPackage: ConfigPackage): ConfigPackageCreationRequest => {
    return {
        packageName: configPackage.packageName,
        description: configPackage.description,
        comment: configPackage.comments,
        reviewers: configPackage.reviewersName,
        versionsGuids:
            configPackage.versions.length > 0
                ? configPackage.versions.map((v: Version) => v.versionGuid)
                : configPackage.versionsGuids,
    };
};
