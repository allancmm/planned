import ConfigPackageContent from '../configPackageContent';
import ConfigPackage from '../entities/configPackage';
import ConfigPackageList from '../entities/configPackageList';
import ReviewComment from '../entities/reviewComment';
import VersionList from '../entities/versionList';
import {FileType} from '../enums/fileType';
import Pageable from '../util/pageable';

export default interface ConfigPackageRepository {
    getUnpackagedVersionList(ruleName: string, page: Pageable): Promise<VersionList>;

    getReadyToMigratePackage(page: Pageable): Promise<ConfigPackageList>;

    getPackageQueue(searchQuery: string, page: Pageable): Promise<ConfigPackageList>;

    getOpenedPackage(): Promise<ConfigPackageList>;

    getPackage(packageGuid: string): Promise<ConfigPackage>;

    getVersionInPackage(packageGuid: string): Promise<VersionList>;

    getPackageContent(packageGuid: string): Promise<ConfigPackageContent[]>;

    getPackageContentData(packageGuid: string, ruleGuid: string): Promise<ConfigPackageContent>;

    getContentDataByVersion(versionGuid: string, fileType: FileType): Promise<string>;

    removeVersionFromPackage(packageGuid: string, versionGuid: string): Promise<void>;

    ignoreUnpackagedRule(versionGuid: string): Promise<void>;

    ignoreUnpackagedRules(versionGuids: string[]): Promise<string>;

    createPackage(configPackage: ConfigPackage): Promise<ConfigPackage>;

    editPackage(configPackage: ConfigPackage): Promise<void>;

    deletePackage(packageGuid: string): Promise<void>;

    getPossibleReviewers(): Promise<string[]>;

    getDefaultReviewers(): Promise<string[]>;

    getCommentsOnPackage(packageGuid: string): Promise<ReviewComment[]>;

    addRuleComment(reviewComment: ReviewComment): Promise<void>;

    addVersionsToPackage(packageGuid: string, versions: string[]): Promise<void>;

    readyToReviewPackage(packageGuid: string): Promise<void>;

    readyToMigratePackage(packgeGuid: string): Promise<void>;

    acceptReviewPackage(packageGuid: string): Promise<void>;

    refuseReviewPackage(packageGuid: string): Promise<void>;

    doesPackageExist(packageGuid: string): Promise<boolean>;
}
