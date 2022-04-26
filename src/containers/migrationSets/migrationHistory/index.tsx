import { format } from 'date-fns';
import {Loading, useLoading, WindowContainer} from 'equisoft-design-ui-elements';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    FileHeaderContainer,
    FileHeaderLabel,
    FileHeaderSection,
    FileHeaderValue
} from '../../../components/editor/fileHeader/style';
import { useTabWithId } from '../../../components/editor/tabs/tabContext';
import { FlexibleDataTableColumn } from '../../../components/general/sidebar/flexibleDataTable';
import {defaultConfigPackageService, defaultEnvironmentService, defaultMigrationSetService} from '../../../lib/context';
import Environment from '../../../lib/domain/entities/environment';
import MigrationSet from '../../../lib/domain/entities/migrationSet';
import MigrationSetList from '../../../lib/domain/entities/migrationSetList';
import MigrationHistorySession from '../../../lib/domain/entities/tabData/migrationHistorySession';
import MigrationSetSession from '../../../lib/domain/entities/tabData/migrationSetSession';
import { MigrationSetStatusEnum } from '../../../lib/domain/enums/migrationSetStatus';
import Pageable from '../../../lib/domain/util/pageable';
import ConfigPackageService from '../../../lib/services/configPackageService';
import EnvironmentService from '../../../lib/services/environmentService';
import MigrationSetService from '../../../lib/services/migrationSetService';
import DataTable from '../../general/dataTable/table';
import MigrationSetContent from '../migrationSetContent/migrationSetContent';
import FilterSetSelect, {ActiveFilter} from './filterMigrationSet';
import {TabContainer} from "../../../components/general";
import useStyles from "./useStyles";


interface MigrationHistoryDocumentProps {
    tabId: string;
    configPackageService: ConfigPackageService;
    environmentService: EnvironmentService;
    migrationSetService: MigrationSetService;
}

const MigrationHistoryDocument = ({
                                      tabId,
                                      configPackageService,
                                      environmentService,
                                      migrationSetService
                                  }: MigrationHistoryDocumentProps) => {
    const tab = useTabWithId(tabId);
    const {data} = tab;

    if (!(data instanceof MigrationHistorySession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const classes = useStyles();

    const [loading, load] = useLoading();

    const [activeFilter, setActiveFilter] = useState<ActiveFilter>('ALL_MIGRATION_SETS');

    const [environments, setEnvironments] = useState<Environment[]>([]);

    const [migrationSets, setMigrationSets] = useState<MigrationSet[]>([]);

    const [page, setPage] = useState(Pageable.withPageOfSize());
    const [searchQuery, setSearchQuery] = useState('');

    const [showPaginator, setShowPaginator] = useState<boolean>(true);

    useEffect(() => {
        fetchEnvironments();
    }, []);

    useEffect(() => {
        page && fetchMigrationSets(searchQuery);
    }, [activeFilter, page?.pageNumber, page?.size]);

    const fetchByFilter = (query: string) => load(async (fetch: (searchQuery: string, searchPage: Pageable) => Promise<MigrationSetList>) => {
        const resp = await fetch(query, page);
        setPage(resp.page);
        setShowPaginator(true);
        setMigrationSets(resp.migrationSets);
    });

    const fetchMigrationSets = (searchValue: string) => {
        switch (activeFilter) {
            case 'ALL_MIGRATION_SETS':
                fetchByFilter(searchValue)(migrationSetService.getAllMigrationSets);
                break;
            case 'READY_TO_MIGRATE_MIGRATION_SETS':
                fetchByFilter(searchValue)(migrationSetService.getAllReadyMigrationSets);
                break;
            case 'SENT_MIGRATION_SETS':
                fetchByFilter(searchValue)(migrationSetService.getAllSentMigrationSets);
                break;
            case 'RECEIVED_MIGRATION_SETS':
                fetchByFilter(searchValue)(migrationSetService.getAllReceivedMigrationSets);
                break;
            default:
                break;
        }
    };

    const fetchEnvironments = async () => {
        const {environments: newE} = await environmentService.getDeploymentFlow();
        setEnvironments(newE);
    };

    const dataTableColumns: FlexibleDataTableColumn[] = [
        {
            name: 'Set Name',
            selector: 'migrationSetName',
        },
        {
            name: 'Comments',
            selector: 'comments',
        },
        {
            name: 'Owner',
            selector: 'lastModifiedBy',
        },
        {
            name: 'Last Modified At',
            cell: (row: MigrationSet) => <div>{format(row.lastModifiedAt, 'MM/dd/yyyy HH:mm:ss')}</div>,
            selector: 'lastModifiedAt',
        },
    ];

    environments.forEach((e) => {
        if(e.deploymentOrder === null) return

        dataTableColumns.push({
            name: e.displayName,
            selector: e.displayName,
            cell: (row: MigrationSet) => {
                if (e.displayName === row.creationEnv) {
                    return 'Created';
                }
                const rowEnv = row.environments.find((env) => env === e.displayName);
                if (rowEnv) {
                    const colHistory = row.migrationHistory.find((h) => h.destination === rowEnv);
                    return colHistory
                        ? MigrationSetStatusEnum.getEnumFromCode(colHistory.status).value ?? 'Undefined Status'
                        : '';
                }
                return '';
            },
        });
    });

    const openMigrationSet = load(async (set: MigrationSet) => {
        const d = new MigrationSetSession();
        if (set) {
            const pkgs = await migrationSetService.getPackagesInMigrationSet(set.migrationSetGuid);
            const versionsLists = await Promise.all(
                pkgs.packages.map((p) =>
                    configPackageService.getVersionInPackage(p.packageGuid).then((vl) => {
                        vl.versions.forEach((v) => (v.fromPackageName = p.packageName));
                        return vl;
                    }),
                ),
            );
            const versions = versionsLists
                .flatMap((v) => v.versions)
                .sort((v1, v2) => {
                    if (
                        v1.rule.ruleGuid === v2.rule.ruleGuid &&
                        v1.rule.override.overrideGuid === v2.rule.override.overrideGuid
                    ) {
                        return v2.versionNumber - v1.versionNumber;
                    }
                    return v1.rule.ruleGuid.localeCompare(v2.rule.ruleGuid);
                });

            d.set = set;
            d.pkgs = pkgs.packages;
            d.versions = versions;
        }
        return d;
    });

    const onChangeSearchBar = async (searchValue: string) => {
        setSearchQuery(searchValue);
        if(searchValue.length === 0) {
            fetchMigrationSets(searchValue);
            return;
        }

        if(searchValue.length > 2) {
            fetchMigrationSets(searchValue);
            setShowPaginator(false);
        }
    }

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <TabContainer className={classes.tabContainer}>
                <FileHeaderContainer>
                    <FileHeaderSection>
                        <div>
                            <FileHeaderLabel>Type:</FileHeaderLabel>
                            <FileHeaderValue>Review Sets Migration History</FileHeaderValue>
                        </div>
                    </FileHeaderSection>
                </FileHeaderContainer>
            </TabContainer>

            <div className={classes.filterContainer}>
                <FilterSetSelect activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </div>

            <DataTable
                columns={dataTableColumns}
                data={migrationSets}
                keyColumn={'migrationSetGuid'}
                defaultSortColumn={'lastModifiedAt'}
                sortDesc
                hasSearchBar
                placeHolderSearchBar={'Search migration set name...'}
                onChangeSearchBar={onChangeSearchBar}
                page={showPaginator ? page : undefined}
                setPage={showPaginator ? setPage : undefined}
                expandable
                expandableComponent={<MigrationSetContent className={classes.migrationSet} />}
                transformForExpandable={openMigrationSet}
            />
        </WindowContainer>
    );
};

MigrationHistoryDocument.defaultProps = {
    configPackageService: defaultConfigPackageService,
    environmentService: defaultEnvironmentService,
    migrationSetService: defaultMigrationSetService,
};

export default MigrationHistoryDocument;