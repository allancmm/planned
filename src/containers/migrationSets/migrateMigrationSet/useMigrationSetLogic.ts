import { useTabActions, useTabWithId } from "../../../components/editor/tabs/tabContext";
import { FormEvent, useContext, useMemo } from "react";
import { SidebarContext } from "../../../components/general/sidebar/sidebarContext";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";
import Environment from "../../../lib/domain/entities/environment";
import { useDialog, useLoading } from "equisoft-design-ui-elements";
import produce, { Draft } from "immer";
import MigrateReviewSession from "../../../lib/domain/entities/tabData/migrateReviewSession";
import { EDIT_TAB_DATA } from "../../../components/editor/tabs/tabReducerTypes";
import { Options } from "../../../components/general";
import Release from "../../../lib/domain/entities/release";
import EnvironmentService from "../../../lib/services/environmentService";
import MigrationSetService from "../../../lib/services/migrationSetService";
import MigrationSet from "../../../lib/domain/entities/migrationSet";
import {toast} from "react-toastify";
import MigrationSetsResponse from "../../../lib/domain/entities/migrationSetsResponse";
import MigrateReview from "../../../lib/domain/entities/migrateReview";

const BUILD_RELEASE_ARTIFACT = "BUILD_RELEASE_ARTIFACT";

const emptyFunction = () => {};

class MigrationSetState  {
        loading = false;
        target = '';
        targetOptions: Options[] =  [];
        migrationSets: MigrationSet[] = [];
        reviews: MigrateReview[] = [];
        show = false;
        migrationResponse = new MigrationSetsResponse();
        isDisableMigrate = false;
        migrateMigrationSets = emptyFunction;
        fetchEnvironments = emptyFunction;
        fetchReviews = emptyFunction;
        toggle = emptyFunction;
        onTargetChange = (_: Options) => {};
}

const useMigrationSetLogic = (tabId: string,
                              environmentService: EnvironmentService,
                              migrationSetService: MigrationSetService) : MigrationSetState => {

    const tab = useTabWithId(tabId);

    const dispatch = useTabActions();
    const { data } = tab;

    if (!(data instanceof MigrateReviewSession)) {
        toast.error(`Tab ${tab.name} has invalid data`);
        return new MigrationSetState();
    }

    const { toggleRefreshSidebar } = useContext(SidebarContext);
    const { openRightbar, closeRightbar } = useContext(RightbarContext);

    const { migrationSets, environment, migrationResponse, reviews, environments, target } = data;

    const [show, toggle] = useDialog();
    const [loading, load] = useLoading();

    const updateSession = (recipe: (draft: Draft<MigrateReviewSession>) => void) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, recipe),
            },
        });
    };

    const fetchReviews = load(async () => {
        if (environment.identifier) {
            const rs = await migrationSetService.fetchMigrationReview(migrationSets, environment);
            updateSession((draft) => {
                draft.reviews = rs;
            });
        }
    });

    const fetchEnvironments = load(async () => {
        const newEnvironmentList = await environmentService.getEnvironmentList('MIGRATION_SET');
        const newEnv = newEnvironmentList.environments[0] ?? new Environment();
        updateSession((draft) => {
            draft.environment = newEnv;
            draft.environments = newEnvironmentList.environments;
            draft.target = newEnv.identifier;
        });
    });

    const targetOptions = useMemo(() : Options[] => {
        const options: Options[] = environments.map((e : Environment) => ({ label: e.displayName, value: e.identifier }));
        options.push({label: "BUILD RELEASE ARTIFACT", value: BUILD_RELEASE_ARTIFACT});
        return options;
    }, [environments])


    const onTargetChange = (option: Options) => {
;        updateSession((draft) => {
            draft.target = option.value;
        });
        if(option.value === BUILD_RELEASE_ARTIFACT) {
            const release = new Release();
            // TODO - Allan - magic number
            release.type = '01';
            const migrationSetGuids = migrationSets.map((m : MigrationSet) => m.migrationSetGuid)?.join(',');
            openRightbar('Build_Release', {release: release, migrationSets: migrationSetGuids});
        } else {
            closeRightbar();
            updateSession((draft) => {
                draft.environment =
                    environments.find((en: Environment) => en.identifier === option.value) ?? new Environment();
            });
        }
    };

    const migrateMigrationSets = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await migrationSetService.migrateSets(migrationSets, environment);
        updateSession((draft) => {
            draft.migrationResponse = resp;
        });
        toggle();
        toggleRefreshSidebar();
    });

    return {
        migrateMigrationSets,
        loading,
        fetchEnvironments,
        target,
        targetOptions,
        migrationSets,
        onTargetChange,
        fetchReviews,
        reviews,
        show,
        toggle,
        migrationResponse,
        isDisableMigrate: target === BUILD_RELEASE_ARTIFACT || loading
    }
}

export default useMigrationSetLogic;