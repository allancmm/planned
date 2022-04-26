import { Button, Loading, RadioButton, Select, SelectOption, TextInput, useLoading } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useTabActions, useTabWithId } from '../../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA, MONACO_DISPOSE } from '../../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../../components/general/sidebar/rightbarContext';
import { defaultGenerateXmlService } from '../../../../lib/context';
import AutomatedTestActionSoap from '../../../../lib/domain/entities/automatedTestItems/automatedTestActionSoap';
import AutomatedTestAssessmentFileCompare from '../../../../lib/domain/entities/automatedTestItems/automatedTestAssessmentFileCompare';
import AutomatedTestAssessmentSql from '../../../../lib/domain/entities/automatedTestItems/automatedTestAssessmentSql';
import AutomatedTestMath from '../../../../lib/domain/entities/automatedTestItems/automatedTestMath';
import DebuggerEntity from '../../../../lib/domain/entities/debuggerEntity';
import FunctionalTestSession from '../../../../lib/domain/entities/tabData/functionalTestSession';
import { EntityLevel } from '../../../../lib/domain/enums/entityLevel';
import { EntityType } from '../../../../lib/domain/enums/entityType';
import GenerateXmlService from '../../../../lib/services/generateXmlService';
import ActivityTypeSelection from './activityTypeSelection';
import ClientTypeSelection from './clientTypeSelection';
import PolicyApplicationTypeSelection from './policyApplicationTypeSelection';
import {
    GenerateXmlForm,
    GenerateXmlWrapper,
    OptionCheckboxWrapper,
    OptionSelectionWrapper,
    OptionWrapper,
} from './style';

interface GenerateXmlDataProps {
    stepId: number;
    tabId: string;
    layoutId: number;
}

interface GenerateXmlProps {
    generateXmlService: GenerateXmlService;
    generateXmlData: GenerateXmlDataProps;
}

const GenerateXmlEntityTypeOptions: SelectOption[] = [
    {
        label: 'Policy',
        value: 'POLICY' as EntityType,
    },
    {
        label: 'Activity',
        value: 'ACTIVITY' as EntityType,
    },
    {
        label: 'Client',
        value: 'CLIENT' as EntityType,
    },
    {
        label: 'Application',
        value: 'APPLICATION' as EntityType,
    },
];

const GenerateXml = ({ generateXmlService, generateXmlData }: GenerateXmlProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const [dataFileName, setDataFileName] = useState('');
    const [entityLevel, setEntityLevel] = useState<EntityLevel>('NONE');
    const [entity, setEntity] = useState<DebuggerEntity | null>(null);
    const [ruleGuid, setRuleGuid] = useState<string>('');
    const [systemCode, setSystemCode] = useState<string>('');
    const [stateCode, setStateCode] = useState<string>('');

    const [loading, load] = useLoading();

    const dispatch = useTabActions();
    const { tabId, layoutId, stepId } = generateXmlData;
    const tab = useTabWithId(tabId);

    const data = tab.data as FunctionalTestSession;

    const handleGenerateXml = load(
        async (e: FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();
            const guid = ruleGuid !== '' ? ruleGuid : entity?.guid ?? '';
            const genericXMLOption = radio === 'fromData' ? 'data' : 'template';
            const dataFile = await generateXmlService.generateXmlFile(
                dataFileName,
                entityLevel,
                genericXMLOption,
                guid,
                systemCode,
                stateCode,
            );
            dispatch({ type: MONACO_DISPOSE, payload: { layoutId, dispose: [stepId] } });
            dispatch({
                type: EDIT_TAB_DATA,
                payload: {
                    tabId,
                    data: produce(data, (draft) => {
                        draft.saved = false;
                        const current = draft.automatedTestCase.steps[stepId];
                        switch (draft.automatedTestCase.steps[stepId].child?.type) {
                            case 'ActionSoap':
                                (current.child as AutomatedTestActionSoap).xml = dataFile.xmlData;
                                break;
                            case 'Math':
                                (current.child as AutomatedTestMath).xml = dataFile.xmlData;
                                break;
                            case 'AssessmentSql':
                                (current.child as AutomatedTestAssessmentSql).xml = dataFile.xmlData;
                                break;
                            case 'AssessmentFileCompare':
                                (current.child as AutomatedTestAssessmentFileCompare).expectedResult = dataFile.xmlData;
                                break;
                        }
                    }),
                },
            });

            closeRightbar();
        },
    );

    const [radio, setRadio] = useState('template');

    const handleSelectEntityLevel = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setEntity(null);
        setEntityLevel(e.target.value as EntityLevel);
        setRuleGuid('');
    };

    return (
        <GenerateXmlForm onSubmit={handleGenerateXml}>
            <div>Generate XML</div>
            <Loading loading={loading} />

            <GenerateXmlWrapper>
                <TextInput
                    value={dataFileName}
                    label="Data file name"
                    onChange={(e) => setDataFileName(e.target.value)}
                    placeholder="Enter name here ..."
                />
                <OptionSelectionWrapper>
                    <OptionWrapper>Option</OptionWrapper>
                    <OptionCheckboxWrapper>
                        <RadioButton
                            label="Template"
                            name="template"
                            value="template"
                            checked={radio === 'template'}
                            onChange={() => setRadio('template')}
                        />
                        <RadioButton
                            label="From Data"
                            name="fromData"
                            value="fromData"
                            checked={radio === 'fromData'}
                            onChange={() => setRadio('fromData')}
                        />
                    </OptionCheckboxWrapper>
                </OptionSelectionWrapper>

                <Select
                    label="Entity Level:"
                    emptySelectText="Select One"
                    options={GenerateXmlEntityTypeOptions}
                    required
                    value={entityLevel}
                    onChange={handleSelectEntityLevel}
                />

                {entityLevel === 'APPLICATION' && (
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
                )}

                {entityLevel === 'POLICY' && (
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
                )}

                {entityLevel === 'CLIENT' && (
                    <ClientTypeSelection radioSelection={radio} load={load} setEntity={setEntity} entity={entity} />
                )}

                {entityLevel === 'ACTIVITY' && (
                    <ActivityTypeSelection
                        radioSelection={radio}
                        load={load}
                        setEntity={setEntity}
                        setRuleGuid={setRuleGuid}
                        entity={entity}
                        ruleGuid={ruleGuid}
                    />
                )}

                {entity?.guid && (
                    <Button buttonType="primary" disabled={!dataFileName}>
                        Generate
                    </Button>
                )}
            </GenerateXmlWrapper>
        </GenerateXmlForm>
    );
};

GenerateXml.defaultProps = {
    generateXmlService: defaultGenerateXmlService,
};

export default GenerateXml;
