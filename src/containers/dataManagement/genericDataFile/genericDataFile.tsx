import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
    CollapseContainer,
    Loading,
    Select,
    SelectOption,
    useLoading,
} from 'equisoft-design-ui-elements';
import {  Button } from "@equisoft/design-elements-react";
import InputText from "../../../components/general/inputText";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import ActivityTypeSelection from '../../../containers/editor/functionalTestTab/generateXml//activityTypeSelection';
import ClientTypeSelection from '../../../containers/editor/functionalTestTab/generateXml/clientTypeSelection';
import { defaultGenerateXmlService } from '../../../lib/context';
import DebuggerEntity from '../../../lib/domain/entities/debuggerEntity';
import GenericDataFileSession from '../../../lib/domain/entities/tabData/genericDataFileSession';
import { EntityLevel } from '../../../lib/domain/enums/entityLevel';
import GenerateXmlService from '../../../lib/services/generateXmlService';
import PolicyApplicationTypeSelection from '../../editor/functionalTestTab/generateXml/policyApplicationTypeSelection';
import {ButtonSection, DataManagementFormContainer, FieldFormWrapper} from '../style';

const OPTIONS_DATA_FILE = [{ label: 'Template', value: 'template'}, { label: 'From Data', value: 'fromData'}];
const GenerateXmlEntityTypeOptions: SelectOption[] = [
    {
        label: 'Policy',
        value: 'POLICY' as EntityLevel,
    },
    {
        label: 'Activity',
        value: 'ACTIVITY' as EntityLevel,
    },
    {
        label: 'Client',
        value: 'CLIENT' as EntityLevel,
    },
    {
        label: 'Application',
        value: 'APPLICATION' as EntityLevel,
    },
];

interface GenerateXmlProps {
    generateXmlService: GenerateXmlService;
}

export const GenericDataFile = ({ generateXmlService }: GenerateXmlProps) => {
    const [loading, load] = useLoading();
    const [entityLevel, setEntityLevel] = useState<EntityLevel>('NONE');
    const [entity, setEntity] = useState<DebuggerEntity | null>(null);
    const [ruleGuid, setRuleGuid] = useState<string>('');
    const [systemCode, setSystemCode] = useState<string>('');
    const [stateCode, setStateCode] = useState<string>('');

    const handleSelectEntityLevel = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setEntity(null);
        setEntityLevel(e.target.value as EntityLevel);
        setRuleGuid('');
    });

    const dispatch = useTabActions();

    const [radio, setRadio] = useState('template');

    const handleGenerateXml = load(
        async (e: FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();
            const guid = ruleGuid !== '' ? ruleGuid : entity?.guid ?? '';
            const genericXMLOption = radio === 'fromData' ? 'data' : 'template';
            const dataFile = await generateXmlService.generateXmlFile(
                'New DataFile',
                entityLevel,
                genericXMLOption,
                guid,
                systemCode,
                stateCode,
            );

            const session = new GenericDataFileSession();
            session.fileGuid = dataFile.dataFileGuid;
            session.name = dataFile.dataFileName;
            session.entityLevel = dataFile.entityLevel;
            session.xmlData = dataFile.xmlData;
            session.newFile = true;
            session.saved = false;

            dispatch({ type: OPEN, payload: { data: session } });
        },
    );

    return (
        <CollapseContainer title="Generate DataFile" defaultOpened>
            <>
                <Loading loading={loading} />
                <DataManagementFormContainer id="SearchForm" onSubmit={handleGenerateXml}>
                    <InputText
                        label='Option'
                        type='radio'
                        groupName='dataFile'
                        options={OPTIONS_DATA_FILE}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRadio(e.target.value)}
                        checkedValue={radio}
                    />

                    <FieldFormWrapper>
                        <Select
                            label="Entity Level"
                            emptySelectText="Select One"
                            options={GenerateXmlEntityTypeOptions}
                            required
                            value={entityLevel}
                            onChange={handleSelectEntityLevel}
                        />
                    </FieldFormWrapper>

                    {entityLevel === 'APPLICATION' && (
                        <FieldFormWrapper>
                            <PolicyApplicationTypeSelection
                                radioSelection={radio}
                                load={load}
                                setEntity={setEntity}
                                setSystemCode={setSystemCode}
                                setStateCode={setStateCode}
                                entityLevel={entityLevel}
                                entity={entity}
                                systemCode={systemCode}
                                stateCode={stateCode}
                            />
                        </FieldFormWrapper>
                    )}

                    {entityLevel === 'POLICY' && (
                        <FieldFormWrapper>
                            <PolicyApplicationTypeSelection
                                radioSelection={radio}
                                load={load}
                                setEntity={setEntity}
                                setSystemCode={setSystemCode}
                                setStateCode={setStateCode}
                                entityLevel={entityLevel}
                                entity={entity}
                                systemCode={systemCode}
                                stateCode={stateCode}
                            />
                        </FieldFormWrapper>
                    )}

                    {entityLevel === 'CLIENT' && (
                        <FieldFormWrapper>
                             <ClientTypeSelection
                                 radioSelection={radio}
                                 load={load}
                                 setEntity={setEntity}
                                 entity={entity} />
                        </FieldFormWrapper>
                    )}

                    {entityLevel === 'ACTIVITY' && (
                        <FieldFormWrapper>
                            <ActivityTypeSelection
                                radioSelection={radio}
                                load={load}
                                setEntity={setEntity}
                                setRuleGuid={setRuleGuid}
                                entity={entity}
                                ruleGuid={ruleGuid}
                            />
                        </FieldFormWrapper>
                    )}

                    {entity?.guid && (
                        <ButtonSection>
                            <Button buttonType="primary" disabled={loading}>
                                Generate
                            </Button>
                        </ButtonSection>
                    )}
                </DataManagementFormContainer>
            </>
        </CollapseContainer>
    );
};

GenericDataFile.defaultProps = {
    generateXmlService: defaultGenerateXmlService,
};

export default GenericDataFile;
