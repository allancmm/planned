import React, {useContext, useEffect, useRef, useState, MouseEvent, ChangeEvent, useMemo} from 'react';
import { FormField, Loading, useLoading } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import {InputText, Options} from "../../../components/general";
import produce, { Draft } from 'immer';
import { useFocusedActiveTab } from '../../../components/editor/tabs/tabContext';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultReleaseService } from '../../../lib/context';
import Release from '../../../lib/domain/entities/release';
import { ReleaseType } from '../../../lib/domain/enums/releaseType';
import { BuildReleaseRequest } from '../../../lib/infra/request/buildReleaseRequest';
import ReleaseService from '../../../lib/services/releaseService';
import { useAppSettings, useCurrentEnvironment } from '../../../page/authContext';
import withLongJob from '../../general/longJob';
import FilterOptions from '../../search/searchRules/filterOptions';
import {LogBuildContainer, ReleaseForm} from './style';
import {downloadFile} from "../../../lib/util/miscellaneous";
import { PanelBreak, PanelTitleContent, PanelContainer } from "../../../components/general/sidebar/style";

interface BuildReleaseDataProps {
    release: Release;
    migrationSets: string;
}

interface BuildReleaseProps {
    data: BuildReleaseDataProps;
    releaseService: ReleaseService;
}

const BuildRelease = ({ data, releaseService }: BuildReleaseProps) => {
    const { release, migrationSets } = data;
    const [request, setRequest] = useState(new BuildReleaseRequest());
    const [templates, setTemplates] = useState<string[]>([]);
    const { toggleRefreshSidebar } = useContext(SidebarContext);
    const { closeRightbar } = useContext(RightbarContext);
    const [, job, displayJobLog, startPollingWithAction] = withLongJob(toggleRefreshSidebar);

    const env = useCurrentEnvironment();
    const { structureType } = useAppSettings();
    const [loading, load] = useLoading();
    const isMigrationSets: boolean = release?.type === '01';
    const [, focusedTabId] = useFocusedActiveTab();
    const ref = useRef(false);

    useEffect(() => {
        fetchTemplates();
        if(isMigrationSets) {
            request.releaseType = 'MIGRATION_SET';
            request.filters.migrationSets = migrationSets;
        }
    }, []);

    useEffect(() => {
        if(isMigrationSets) {
            if (ref.current) {
                closeRightbar();
            } else {
                ref.current = true;
            }
        }
    }, [focusedTabId]);

    const fetchTemplates = () => {
        releaseService.getTemplateList().then(setTemplates);
    };

    const editRequest = (recipe: (draft: Draft<BuildReleaseRequest>) => void) => {
        setRequest(produce(request, recipe));
    };

    const types = useMemo(() :  ReleaseType[] =>
        isMigrationSets ? ['MIGRATION_SET'] : (structureType === 'BUSINESS') ? ['ARTIFACT_OIPA', 'CUSTOM'] : ['ARTIFACT_OIPA'],
        [isMigrationSets, structureType]);

    const optionsRelease = useMemo(() :Options[] => {
        const list = types.map((type: ReleaseType) => ({ label: type as string, value: type as string }));
        if(!isMigrationSets) {
            list.unshift({ label: 'Select one', value: ''});
        }
        return list;
    }, [isMigrationSets, types]);

    const optionsTemplate = useMemo(() :Options[] =>
        ([{ label: "Select one", value: ''}, ...templates.sort().map((t) => ({ label: t, value: t }))]),
        [templates]);

    const downloadAsZip = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { resultData: { path, releaseName }} = job;
        const file = await releaseService.downloadRelease(path, releaseName);
        downloadFile(releaseName, file);
    };

    return (
        <>
            <Loading loading={loading} />
            <PanelContainer>
                <PanelTitleContent>Build Release</PanelTitleContent>
                <PanelBreak />
                <ReleaseForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        startPollingWithAction(() => releaseService.buildRelease(request));
                    }}
                >
                    <InputText
                        label="Type of Release"
                        type='select'
                        value={request.releaseType}
                        onChange={(o: Options) =>
                            editRequest((draft) => {
                                draft.releaseType = o.value as ReleaseType;
                            })
                        }
                        options={optionsRelease}
                        disabled={isMigrationSets}
                        required
                    />

                    {request.releaseType !== 'CUSTOM' && !isMigrationSets && (
                        <InputText
                            label="Template"
                            type='select'
                            value={request.releaseTemplate}
                            onChange={(o: Options) =>
                                editRequest((draft) => {
                                    draft.releaseTemplate = o.value;
                                })
                            }
                            options={optionsTemplate}
                            required
                        />
                    )}

                    <InputText
                        label="Name"
                        value={request.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            editRequest((draft) => {
                                draft.name = e.target.value;
                            })
                        }
                    />

                    <InputText
                        label="Description"
                        value={request.description}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            editRequest((draft) => {
                                draft.description = e.target.value;
                            })
                        }
                    />

                    <InputText label="Source Environment:" value={env.displayName} disabled onChange={() => {}} />

                    {request.releaseType === 'CUSTOM' && (
                        <FilterOptions
                            data={request.filters}
                            filterByTransaction
                            editFilter={(recipe) =>
                                editRequest((draft) => {
                                    draft.filters = produce(request.filters, recipe);
                                })
                            }
                            load={load}
                        />
                    )}

                     <Button buttonType="primary" type="submit" disabled={job.status === 'IN_PROGRESS'}>
                        Build
                    </Button>

                    <LogBuildContainer>
                        {displayJobLog}
                        {(job.status === 'COMPLETED' || job.status === 'WARNINGS') && (
                            <>
                                <FormField label="SHA-256 checksum: " fieldId="Checksum">
                                    {job?.resultData?.sha256Checksum}
                                </FormField>
                                <Button
                                    type="button"
                                    buttonType="secondary"
                                    onClick={downloadAsZip}
                                >
                                    Download as ZIP
                                </Button>
                            </>
                        )}
                    </LogBuildContainer>
                </ReleaseForm>
            </PanelContainer>
        </>
    );
};

BuildRelease.defaultProps = {
    releaseService: defaultReleaseService,
};

export default BuildRelease;
