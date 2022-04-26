import ConfigPackageContent from '../domain/configPackageContent';
import ConfigPackage from '../domain/entities/configPackage';
import ConfigPackageList from '../domain/entities/configPackageList';
import ReviewComment from '../domain/entities/reviewComment';
import VersionList from '../domain/entities/versionList';
import {FileType} from '../domain/enums/fileType';
import ConfigPackageRepository from '../domain/repositories/configPackageRepository';
import Pageable from '../domain/util/pageable';

export default class ConfigPackageService {
    constructor(private configPackageRepository: ConfigPackageRepository) {}

    // Getters
    getUnpackagedVersionList = async (ruleName: string, page: Pageable): Promise<VersionList> => {
        return this.configPackageRepository.getUnpackagedVersionList(ruleName, page);
    };

    getReadyToMigratePackage = async (page: Pageable): Promise<ConfigPackageList> => {
        return this.configPackageRepository.getReadyToMigratePackage(page);
    };

    getPackageQueue = async (searchQuery: string, page: Pageable): Promise<ConfigPackageList> => {
        return this.configPackageRepository.getPackageQueue(searchQuery, page);
    };

    getOpenedPackage = async (): Promise<ConfigPackageList> => {
        return this.configPackageRepository.getOpenedPackage();
    };

    getPackage = async (packageGuid: string): Promise<ConfigPackage> => {
        return this.configPackageRepository.getPackage(packageGuid);
    };

    doesPackageExist = async (packageGuid: string): Promise<boolean> => {
        return this.configPackageRepository.doesPackageExist(packageGuid);
    }

    getPackageContent = async (packageGuid: string): Promise<ConfigPackageContent[]> => {
        return this.configPackageRepository.getPackageContent(packageGuid);
    };

    getPackageContentData = async (packageGuid: string, ruleGuid: string): Promise<ConfigPackageContent> => {
        return this.configPackageRepository.getPackageContentData(packageGuid, ruleGuid);
    };

    getContentDataByVersion = async (versionGuid: string, fileType: FileType): Promise<string> => {
        return this.configPackageRepository.getContentDataByVersion(versionGuid, fileType);
    };

    getVersionInPackage = async (packageGuid: string): Promise<VersionList> => {
        return this.configPackageRepository.getVersionInPackage(packageGuid);
    };

    getCommentsOnPackage = async (packageGuid: string): Promise<ReviewComment[]> => {
        return this.configPackageRepository.getCommentsOnPackage(packageGuid);
    };

    removeVersionFromPackage = async (packageGuid: string, versionGuid: string): Promise<void> => {
        return this.configPackageRepository.removeVersionFromPackage(packageGuid, versionGuid);
    };

    // Actions
    ignoreUnpackagedRule = async (versionGuid: string): Promise<void> => {
        return this.configPackageRepository.ignoreUnpackagedRule(versionGuid);
    };

    ignoreUnpackagedRules = async (versionGuids: string[]): Promise<string> => {
        return this.configPackageRepository.ignoreUnpackagedRules(versionGuids);
    };

    createPackage = async (configPackage: ConfigPackage): Promise<ConfigPackage> => {
        return this.configPackageRepository.createPackage(configPackage);
    };

    editPackage = async (configPackage: ConfigPackage): Promise<void> => {
        return this.configPackageRepository.editPackage(configPackage);
    };

    deletePackage = async (packageGuid: string): Promise<void> => {
        return this.configPackageRepository.deletePackage(packageGuid);
    };

    addRuleComment = async (reviewComment: ReviewComment): Promise<void> => {
        return this.configPackageRepository.addRuleComment(reviewComment);
    };

    addVersionsToPackage = async (packageGuid: string, versions: string[]): Promise<void> => {
        return this.configPackageRepository.addVersionsToPackage(packageGuid, versions);
    };

    // Reviewers

    getPossibleReviewers = async (): Promise<string[]> => {
        return this.configPackageRepository.getPossibleReviewers();
    };

    getDefaultReviewers = async (): Promise<string[]> => {
        return this.configPackageRepository.getDefaultReviewers();
    };

    readyToReviewPackage = async (packageGuid: string): Promise<void> => {
        return this.configPackageRepository.readyToReviewPackage(packageGuid);
    };

    readyToMigratePackage = async (packageGuid: string): Promise<void> => {
        return this.configPackageRepository.readyToMigratePackage(packageGuid);
    };

    acceptReviewPackage = async (packageGuid: string): Promise<void> => {
        return this.configPackageRepository.acceptReviewPackage(packageGuid);
    };

    refuseReviewPackage = async (packageGuid: string): Promise<void> => {
        return this.configPackageRepository.refuseReviewPackage(packageGuid);
    };
}
