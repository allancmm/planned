import { format } from 'date-fns';
import {Button, Checkbox, CollapseContainer, FormField, Select} from 'equisoft-design-ui-elements';
import React, {useContext, useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultEnvironmentService, defaultReleaseService } from '../../../lib/context';
import Environment from '../../../lib/domain/entities/environment';
import { MigrationHistory } from '../../../lib/domain/entities/migrationHistory';
import Release from '../../../lib/domain/entities/release';
import ReleaseChecksum from '../../../lib/domain/entities/releaseChecksum';
import EnvironmentService from '../../../lib/services/environmentService';
import ReleaseService from '../../../lib/services/releaseService';
import withLongJob from '../../general/longJob/index';
import { ReleaseForm } from '../buildRelease/style';
import { ChecksumSection } from './style';

interface DeployReleaseProps {
    release: Release;

    releaseService: ReleaseService;
    environmentService: EnvironmentService;
}

const DeployRelease = ({ release, releaseService, environmentService }: DeployReleaseProps) => {
    const [target, setTarget] = useState('');
    const [history, setHistory] = useState<MigrationHistory[]>([]);
    const [checksum, setChecksum] = useState<ReleaseChecksum>(new ReleaseChecksum());
    const [requiresConfirmation, setRequiresConfirmation] = useState(false);
    const [force, setForce] = useState(false);

    const { toggleRefreshSidebar } = useContext(SidebarContext);
    const [, , displayJobLog, startPollingWithAction] = withLongJob(toggleRefreshSidebar);

    const [environments, setEnvironments] = useState<Environment[]>([]);

    useEffect(() => {
        fetchEnvironments();
    }, []);

    useEffect(() => {
        doFetchHistory();
        doFetchChecksum();
    }, [release]);

    useEffect(() => {
        if (checksum.metadataChecksum && checksum.metadataChecksum !== checksum.currentChecksum) {
            toast.warning(
                'This artifact has been modified and might cause errors when deploy. Do you want to continue anyway?',
            );
            setRequiresConfirmation(true);
        } else {
            setRequiresConfirmation(false);
        }
        setForce(false);
    }, [checksum]);

    const fetchEnvironments = async () => {
        const envs = await environmentService.getEnvironmentList('RELEASE_ARTIFACT');
        setEnvironments(envs.environments);
    };

    const deployRelease = async (path?: string) => {
        return releaseService.deployRelease(release, target, path);
    };

    const doFetchHistory = async () => {
        const newHistory = await releaseService.getReleaseHistory(release);
        setHistory(newHistory);
    };

    const doFetchChecksum = async () => {
        const checksumData = await releaseService.getChecksum(release);
        setChecksum(checksumData);
    };

    return (
        <ReleaseForm
            onSubmit={(e) => {
                e.preventDefault();
                startPollingWithAction(deployRelease);
            }}
        >
            <h3>Deploy Release</h3>
            <h4>{release.name}</h4>
            <div>
                <Select
                    label="Target Environment:"
                    name="environment"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    options={environments.map((e: Environment) => ({ label: e.displayName, value: e.identifier }))}
                    emptySelectText={environments.length > 0 ? "Select One" : 'No environment found'}
                    disabled={environments.length === 0}
                />
            </div>

            <CollapseContainer title="Checksum" defaultOpened>
                <ChecksumSection>
                    <FormField fieldId={uuid()} label="Metadata checksum:">
                        <span>{checksum.metadataChecksum}</span>
                    </FormField>
                    <FormField fieldId={uuid()} label="Computed checksum:">
                        <span>{checksum.currentChecksum}</span>
                    </FormField>
                    {requiresConfirmation && (
                        <Checkbox
                            value=""
                            name="Force Deploy"
                            label="I've acknowledged the artifact changed, and want to deploy anyways."
                            checked={force}
                            onChange={(e) => setForce(e.target.checked)}
                        />
                    )}
                </ChecksumSection>
            </CollapseContainer>

            <CollapseContainer title="Release History" defaultOpened>
                <>
                    {history.length > 0 ? (
                        <ul>
                            {history.map((h: MigrationHistory) => (
                                <li key={h.migrationHistoryGuid}>
                                    <p>
                                        {`(${h.status}) ${h.source} => ${h.destination} | ${format(
                                            h.migrationDate,
                                            'yyyy-MM-dd',
                                        )}`}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No History</div>
                    )}
                </>
            </CollapseContainer>

            {displayJobLog}
            <Button buttonType="primary" type="submit" disabled={environments.length === 0 || !(!requiresConfirmation || force)}>
                Deploy
            </Button>
        </ReleaseForm>
    );
};

DeployRelease.defaultProps = {
    releaseService: defaultReleaseService,
    environmentService: defaultEnvironmentService,
};

export default DeployRelease;
