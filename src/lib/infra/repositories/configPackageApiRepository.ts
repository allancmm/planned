import ConfigPackageContent from '../../domain/configPackageContent';
import ConfigPackage from '../../domain/entities/configPackage';
import ConfigPackageList from '../../domain/entities/configPackageList';
import ReviewComment from '../../domain/entities/reviewComment';
import VersionList from '../../domain/entities/versionList';
import {FileType} from '../../domain/enums/fileType';
import configPackageRepository from '../../domain/repositories/configPackageRepository';
import Pageable from '../../domain/util/pageable';
import * as ConfigPackageAssembler from '../assembler/configPackageAssembler';
import * as ReviewCommentAssembler from '../assembler/reviewCommentAssembler';
import { ApiGateway } from '../config/apiGateway';
import { ConfigPackageCreationRequest } from '../request/configPackageCreationRequest';
import { ReviewCommentCreationRequest } from '../request/ReviewCommentCreationRequest';

export default class ConfigPackageApiRepository implements configPackageRepository {
    constructor(private api: ApiGateway) {}

    getUnpackagedVersionList = async (ruleName: string, page: Pageable): Promise<VersionList> =>
        this.api.get(`/packages/unpackaged?pageNumber=${page.pageNumber}&size=${page.size}&ruleName=${ruleName}`,
            { outType: VersionList });

    getReadyToMigratePackage = async (page: Pageable): Promise<ConfigPackageList> => {
        return this.api.get(`/packages/readyToMigrate?pageNumber=${page.pageNumber}&size=${page.size}`, {
            outType: ConfigPackageList,
        });
    };

    getPackageQueue = async (searchQuery: string, page: Pageable): Promise<ConfigPackageList> => {
        return this.api.get(
            `/packages/queue?searchQuery=${searchQuery}&pageNumber=${page.pageNumber}&size=${page.size}`,
            {
                outType: ConfigPackageList,
            },
        );
    };

    getOpenedPackage = async (): Promise<ConfigPackageList> => {
        return this.api.get(`/packages/open`, { outType: ConfigPackageList });
    };

    getPackage = async (packageGuid: string): Promise<ConfigPackage> => {
        return this.api.get(`/packages/${packageGuid}`, { outType: ConfigPackage });
    };

    doesPackageExist = async (packageGuid: string): Promise<boolean> => {
        return this.api.get(`/packages/${packageGuid}/exist`);
    }

    getVersionInPackage = async (packageGuid: string): Promise<VersionList> => {
        return this.api.get(`/packages/${packageGuid}/versions`, { outType: VersionList });
    };

    getPackageContent = async (packageGuid: string): Promise<ConfigPackageContent[]> => {
        return this.api.getArray(`/packages/${packageGuid}/content`, { outType: ConfigPackageContent });
    };

    getPackageContentData = async (packageGuid: string, ruleGuid: string): Promise<ConfigPackageContent> => {
        return this.api.get(`/packages/${packageGuid}/content/${ruleGuid}`, { outType: ConfigPackageContent });
    };

    getContentDataByVersion = async (versionGuid: string, fileType: FileType): Promise<string> => {
        return this.api.get(`/packages/contentData/${versionGuid}/${fileType}`);
    };

    removeVersionFromPackage = async (packageGuid: string, versionGuid: string): Promise<void> => {
        return this.api.delete(`/packages/${packageGuid}/versions/${versionGuid}`);
    };

    ignoreUnpackagedRule = async (versionGuid: string): Promise<void> => {
        return this.api.put(`/packages/ignore/${versionGuid}`);
    };

    ignoreUnpackagedRules = async (versionGuids: string[]): Promise<string> => {
        return this.api.put(`/packages/ignore/versions`, versionGuids);
    };

    createPackage = async (configPackage: ConfigPackage): Promise<ConfigPackage> => {
        return this.api.post(`/packages`, ConfigPackageAssembler.toConfigPackageCreationRequest(configPackage), {
            inType: ConfigPackageCreationRequest,
            outType: ConfigPackage
        });
    };

    editPackage = async (configPackage: ConfigPackage): Promise<void> => {
        return this.api.put(
            `/packages/${configPackage.packageGuid}`,
            ConfigPackageAssembler.toConfigPackageCreationRequest(configPackage),
            { inType: ConfigPackageCreationRequest },
        );
    };

    deletePackage = async (packageGuid: string): Promise<void> => {
        return this.api.delete(`/packages/${packageGuid}`);
    };

    getPossibleReviewers = async (): Promise<string[]> => {
        return this.api.getArray(`/packages/reviewers/possible`);
    };

    getDefaultReviewers = async (): Promise<string[]> => {
        return this.api.getArray(`/packages/reviewers/defaultList`);
    };

    getCommentsOnPackage = async (packageGuid: string): Promise<ReviewComment[]> => {
        return this.api.getArray(`/packages/${packageGuid}/comment`, { outType: ReviewComment });
    };

    addRuleComment = async (reviewComment: ReviewComment): Promise<void> => {
        return this.api.post(
            `/packages/${reviewComment.configPackageGuid}/comment`,
            ReviewCommentAssembler.toReviewCommentCreationRequest(reviewComment),
            { inType: ReviewCommentCreationRequest },
        );
    };

    addVersionsToPackage = async (packageGuid: string, versions: string[]): Promise<void> => {
        return this.api.post(`/packages/${packageGuid}/versions`, versions);
    };

    readyToReviewPackage = async (packageGuid: string): Promise<void> => {
        return this.api.put(`/packages/${packageGuid}/readyToReview`);
    };

    readyToMigratePackage = async (packageGuid: string): Promise<void> => {
        return this.api.put(`/packages/${packageGuid}/readyToMigrate`);
    };

    acceptReviewPackage = async (packageGuid: string): Promise<void> => {
        return this.api.put(`/packages/${packageGuid}/accept`);
    };

    refuseReviewPackage = async (packageGuid: string): Promise<void> => {
        return this.api.put(`/packages/${packageGuid}/refuse`);
    };
}
