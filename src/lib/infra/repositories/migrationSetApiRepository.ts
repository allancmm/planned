import ConfigPackageList from '../../domain/entities/configPackageList';
import Environment from '../../domain/entities/environment';
import MigrateReview from '../../domain/entities/migrateReview';
import MigrationHistoryList from '../../domain/entities/migrationHistoryList';
import MigrationSet from '../../domain/entities/migrationSet';
import MigrationSetList from '../../domain/entities/migrationSetList';
import MigrationSetsResponse from '../../domain/entities/migrationSetsResponse';
import MigrationSetRepository from '../../domain/repositories/migrationSetRepository';
import Pageable from '../../domain/util/pageable';
import * as MigrationSetAssembler from '../assembler/migrationSetAssembler';
import { ApiGateway } from '../config/apiGateway';
import { MigrateRequest, MigrateReviewRequest } from '../request/MigrateRequest';
import { MigrationSetCreationRequest } from '../request/MigrationSetCreationRequest';
import {MigrationSetEditRequest} from "../request/migrationSetEditRequest";

export default class MigrationSetApiRepository implements MigrationSetRepository {
    constructor(private api: ApiGateway) {}

    getReadyToMigrateSets = async (): Promise<MigrationSetList> => {
        const page = Pageable.withPageOfSize(Pageable.MAX_SAFE_JAVA_INTEGER);
        return this.api.get(`/migrationSet/readyToMigrate?pageNumber=${page.pageNumber}&size=${page.size}`, {
            outType: MigrationSetList,
        });
    };

    getAllMigrationSets = async (searchQuery: string, page: Pageable): Promise<MigrationSetList> => {
        return this.api.get(
            `/migrationSet/filters/all?searchQuery=${searchQuery}&pageNumber=${page.pageNumber}&size=${page.size}`,
            {
                outType: MigrationSetList,
            },
        );
    };

    getAllReadyMigrationSets = async (searchQuery: string, page: Pageable): Promise<MigrationSetList> => {
        return this.api.get(
            `/migrationSet/filters/ready?searchQuery=${searchQuery}&pageNumber=${page.pageNumber}&size=${page.size}`,
            {
                outType: MigrationSetList,
            },
        );
    };

    getAllSentMigrationSets = async (searchQuery: string, page: Pageable): Promise<MigrationSetList> => {
        return this.api.get(
            `/migrationSet/filters/sent?searchQuery=${searchQuery}&pageNumber=${page.pageNumber}&size=${page.size}`,
            {
                outType: MigrationSetList,
            },
        );
    };

    getAllReceivedMigrationSets = async (searchQuery: string, page: Pageable): Promise<MigrationSetList> => {
        return this.api.get(
            `/migrationSet/filters/received?searchQuery=${searchQuery}&pageNumber=${page.pageNumber}&size=${page.size}`,
            {
                outType: MigrationSetList,
            },
        );
    };

    createMigrationSet = async (name: string, packagesNames: string[]): Promise<void> => {
        return this.api.post(
            `/migrationSet`,
            MigrationSetAssembler.toMigrationSetCreationRequest(name, packagesNames),
            {
                inType: MigrationSetCreationRequest,
            },
        );
    };

    addPackageToMigrationSet = async (migrationSet: MigrationSet, packagesNames: string[]): Promise<void> => {
        return this.api.put(
            `/migrationSet/${migrationSet.migrationSetGuid}`,
            MigrationSetAssembler.toMigrationSetCreationRequest(
                migrationSet.migrationSetName,
                packagesNames,
            ),
            {
                inType: MigrationSetCreationRequest,
            },
        );
    };

    migrateSets = async (migrationSets: MigrationSet[], environment: Environment): Promise<MigrationSetsResponse> => {
        return this.api.post(
            `/migrationSet/migrate`,
            MigrationSetAssembler.toMigrateRequest(environment, migrationSets),
            {
                inType: MigrateRequest,
                outType: MigrationSetsResponse,
            },
        );
    };

    editMigrationSet = async (migrationSet: MigrationSet): Promise<void> => {
        return this.api.put(`/migrationSet/${migrationSet.migrationSetGuid}/edit`,
            MigrationSetAssembler.toMigrateSet(migrationSet.migrationSetName, migrationSet.comments, migrationSet.configPackagesGuids),
            {inType: MigrationSetEditRequest}
        );
    }

    reopenMigrationSet = async (migrationSetGuid: string): Promise<string> => {
        return this.api.put(`/migrationSet/${migrationSetGuid}/reopen`);
    };

    getPackagesInMigrationSet = async (migrationSetGuid: string): Promise<ConfigPackageList> => {
        return this.api.get(`/migrationSet/${migrationSetGuid}/packages`, {
            outType: ConfigPackageList
        });
    };

    getSetHistory = async (migrationSetGuid: string): Promise<MigrationHistoryList> => {
        return this.api.get(`/oipa/reports/migrationSet/migrationHistory/${migrationSetGuid}`, {
            outType: MigrationHistoryList,
        });
    };

    reviewMigrationSets = async (migrationSets: MigrationSet[], environment: Environment): Promise<MigrateReview[]> => {
        return this.api.postReturnArray(
            `/migrationSet/review`,
            {
                migrationSetsGuids: migrationSets.map((m) => m.migrationSetGuid),
                targetEnvironmentId: environment.identifier,
            },
            { inType: MigrateReviewRequest, outType: MigrateReview },
        );
    };

    deleteMigrationSet = async (migrationSetGuid: string): Promise<void> =>
        this.api.delete(`/migrationSet/${migrationSetGuid}`);
}
