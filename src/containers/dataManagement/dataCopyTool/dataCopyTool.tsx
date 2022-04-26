import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button } from '@equisoft/design-elements-react';
import { CollapseContainer, Loading, Select, TextInput, useLoading } from 'equisoft-design-ui-elements';
import { toast } from 'react-toastify';
import {
    defaultDataCopyToolService,
    defaultDebuggerEntitiesService,
    defaultEnvironmentService,
} from '../../../lib/context';
import CopySequence from '../../../lib/domain/entities/copySequence';
import Environment from '../../../lib/domain/entities/environment';
import DataCopyToolService from '../../../lib/services/dataCopyToolService';
import EnvironmentService from '../../../lib/services/environmentService';
import { EntityLevelContainer } from '../../editor/debugger/style';
import { DataManagementFormContainer, FieldFormWrapper } from '../style';

interface DataCopyToolProps {
    environmentService: EnvironmentService;
    dataCopyToolService: DataCopyToolService;
}

const ActionTypeOptions: string[] = ['Copy', 'Export', 'Import'];

const DataCopyTool = ({ environmentService, dataCopyToolService }: DataCopyToolProps) => {
    const [loading, load] = useLoading();
    const [environments, setEnvironments] = useState<Environment[]>([]);
    const [prefix, setPrefix] = useState<string>('');
    const [sequenceName, setSequenceName] = useState<string>('');
    const [sourceEnvironment, setSourceEnvironment] = useState<Environment>();
    const [destinationEnvironment, setDestinationEnvironment] = useState<Environment>();
    const [action, setAction] = useState<string>('');
    const [copySequences, setCopySequences] = useState<CopySequence[]>([]);
    const [parameters, setParameters] = useState<string[]>([]);
    const [parameter, setParameter] = useState<string>('');
    const [entityGuid, setEntityGuid] = useState<string>('');
    const [file, setFile] = useState<Blob>(new Blob());


    useEffect(() => {
        fetchEnvironments();
        fetchCopySequences();
    }, []);

    const fetchEnvironments = async () => {
        const envs = await environmentService.getEnvironmentList();
        setEnvironments(envs.environments);
    };

    const fetchCopySequences = async () => {
        const sequences = await dataCopyToolService.getCopySequences();
        setCopySequences(sequences);
    };

    const handleSelectSource = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const source = environments.find((env) => env.identifier === e.target.value);
        setSourceEnvironment(source);
    };

    const handleSelectDestination = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const destination = environments.find((env) => env.identifier === e.target.value);
        setDestinationEnvironment(destination);
    };

    const handleSelectSequenceName = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setSequenceName(e.target.value);
        const sequence = copySequences.find((src) => src.name === e.target.value);
        if (sequence) {
            setParameters(sequence.parameters);
        }
        setEntityGuid('');
    });


    const handleDataCopyTool = load(
        async (e: FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();
            if (action === 'Copy') {
                if ((entityGuid) && sourceEnvironment && destinationEnvironment) {
                    const result = await dataCopyToolService.callDataCopyTool(sequenceName, sourceEnvironment.identifier, destinationEnvironment.identifier, entityGuid, 1, prefix)
                    toast.success(result);
                }
                return;
            }

            if (action === 'Export') {
                if (sourceEnvironment) {
                    const result = await dataCopyToolService.export(sequenceName, sourceEnvironment.identifier, entityGuid, prefix);
                    toast.success(result);
                }
              return;
            }

            if (destinationEnvironment) {
                const result = await dataCopyToolService.import(file, destinationEnvironment.identifier);
                toast.success(result);
            }
        },
    );

    const handleParametersEntityType = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setParameter(e.target.value)
    };

    const onFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const f = new Blob([e.target.files[0]]);
            setFile(f);
        }
    };

    return (
        <CollapseContainer title="Data Copy Tool" defaultOpened>
            <>
                <Loading loading={loading} />
                <DataManagementFormContainer id="SelectForm" onSubmit={handleDataCopyTool}>
                    <EntityLevelContainer>
                        <Select
                            label="Action Type"
                            emptySelectText="Select One"
                            options={ActionTypeOptions.map((c) => ({ label: c, value: c }))}
                            required
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                        />
                        {action !== 'Import' && (
                            <FieldFormWrapper>
                                <Select
                                    label="Source"
                                    emptySelectText="Select One"
                                    required
                                    options={environments.map((e) => ({
                                        label: e.displayName,
                                        value: e.identifier,
                                    }))}
                                    onChange={handleSelectSource}
                                />
                            </FieldFormWrapper>
                        )}

                        {action !== 'Export' && (
                            <FieldFormWrapper>
                                <Select
                                    label="Destination"
                                    emptySelectText="Select One"
                                    required
                                    options={environments.map((e) => ({
                                        label: e.displayName,
                                        value: e.identifier,
                                    }))}
                                    onChange={handleSelectDestination}
                                />
                            </FieldFormWrapper>
                        )}

                        {action !== 'Import' && (
                            <FieldFormWrapper>
                                <Select
                                    label="Sequence Name"
                                    emptySelectText="Select One"
                                    required
                                    options={copySequences.map((e) => ({
                                        label: e.name,
                                        value: e.name,
                                    }))}
                                    onChange={handleSelectSequenceName}
                                />
                            </FieldFormWrapper>
                        )}

                        {action !== 'Import' && (
                            <FieldFormWrapper>
                                <Select
                                    label="Parameters"
                                    emptySelectText="Select One"
                                    options={parameters.map((e) => ({
                                        label: e,
                                        value: e,
                                    }))}
                                    required
                                    value={parameter}
                                    onChange={handleParametersEntityType}
                                />
                            </FieldFormWrapper>
                        )}

                        {(action === 'Copy' || action === 'Export') && (
                            <>
                                <FieldFormWrapper>
                                    <TextInput
                                        label="Entity Guid "
                                        placeholder="Entity Guid"
                                        value={entityGuid}
                                        required
                                        onChange={(e) => setEntityGuid(e.target.value)}
                                    />
                                </FieldFormWrapper>

                                <FieldFormWrapper>
                                    <TextInput
                                    label="Prefix"
                                    placeholder="Prefix"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                    />
                                </FieldFormWrapper>
                             </>
                        )}              

                        {action === 'Copy' && (
                            <Button buttonType="primary" disabled={loading}>Generate</Button>
                        )}

                        {action === 'Export' && (
                            <Button buttonType="primary" disabled={loading}>Export</Button>
                        )}
                        {action === 'Import' && (
                            <>
                                <TextInput label="File" type="file" onChange={onFileUpload} />
                                <Button buttonType="primary" disabled={loading}>Import</Button>
                            </>
                        )}
                        </EntityLevelContainer>                    
                </DataManagementFormContainer>
            </>
        </CollapseContainer>
    );
};
DataCopyTool.defaultProps = {
    environmentService: defaultEnvironmentService,
    dataCopyToolService: defaultDataCopyToolService,
    debuggerEntitiesService: defaultDebuggerEntitiesService,
};
export default DataCopyTool;