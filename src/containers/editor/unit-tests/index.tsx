import React,
{
    ChangeEvent, KeyboardEvent,
    MouseEvent,
    useCallback,
    useContext,
    useEffect, useMemo,
    useState
} from 'react';
import { Loading, useDialog, useLoading, Select, CollapseContainer } from 'equisoft-design-ui-elements';
import { Button, useModal } from "@equisoft/design-elements-react";
import produce, {Draft} from 'immer';
import { CheckCircle as UnitTestIcon } from 'react-feather';
import SelectMulti from 'react-select';
import Creatable from 'react-select/creatable';
import { useFocusedActiveTab, useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import {MONACO_DISPOSE, OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {notifyError} from '../../../components/general/error';
import ActionNavButton from '../../../components/general/sidebar/actionNav/actionNavButton';
import { ActionNav, ActionNavItem, NavItem } from '../../../components/general/sidebar/actionNav/style';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { PanelTitle } from '../../../components/general/sidebar/style';
import {defaultDebuggerEntitiesService, defaultEntityInformationService, defaultUnitTestService} from '../../../lib/context';
import {ErrorInformation} from '../../../lib/domain/entities/apiError';
import DebuggerForm from '../../../lib/domain/entities/debuggerForm';
import {RunTestSuiteRequest} from '../../../lib/domain/entities/runTestSuiteRequest';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import InterpreterSession from '../../../lib/domain/entities/tabData/interpreterSession';
import TestReport from '../../../lib/domain/entities/tabData/testReport';
import TestCase from '../../../lib/domain/entities/testCase';
import TestSuite from '../../../lib/domain/entities/testSuite';
import TestTypes from '../../../lib/domain/entities/testTypes';
import {brToEntityType, EntityType, toEntityType} from '../../../lib/domain/enums/entityType';
import DebuggerEntitiesService from '../../../lib/services/debuggerEntitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import UnitTestService from '../../../lib/services/unitTestService';
import ModalDialog from "../../../components/general/modalDialog";
import { CancelIcon, CheckIcon, RightButton } from '../../functionalTest/automatedTestTree/style';
import {
    CoverageSection,
    RunTestSuiteButton,
    TestCaseList, UnitTestContainer, UnitTestRunSection,
    UnitTestSection
} from './style';
import {TestReportResult} from "../../../lib/domain/entities/testReportResult";
import ReportsContent from "./reportsContent";
import { DataGridWrapper } from "../../../components/general/dataGrid/style";

interface ModalProps {
    children?: JSX.Element,
    confirmButton?: {}
}

const UnitTestPanel = ({
                           unitTestService,
                           entityInformationService,
                           debuggerEntitiesService,
                       }: {
    unitTestService: UnitTestService;
    entityInformationService: EntityInformationService;
    debuggerEntitiesService: DebuggerEntitiesService;
}) => {
    const { openRightbar, closeRightbar } = useContext(RightbarContext);
    const { refreshSidebar } = useContext(SidebarContext);
    const [layoutId, tabId] = useFocusedActiveTab();
    const tab = useTabWithId(tabId);

    const dispatch = useTabActions();

    const [loading, load] = useLoading();

    const [entityType, setEntityType] = useState<EntityType>('');
    const [typesWithCoverage, setTypesWithCoverage] = useState<TestTypes[]>([]);
    const [types, setTypes] = useState<EntityType[]>([]);

    const [unitTestGuid, setUnitTestGuid] = useState('');
    const [suites, setSuites] = useState<TestSuite[]>([]);

    const [testCases, setTestCases] = useState<TestCase[]>([]);

    const [runTags, setRunTags] = useState({
        inputValue: null as string[] | null,
        tag: [] as string[]
    });

    const [tags, setTags] = useState({
        entityType: '',
        unitTestGuid: '',
        inputValue: '',
        tag: [] as any[]
    });

    const [testReport, setTestReport] = useState<TestReportResult[]>([]);

    const [dialogProps, setDialogProps] = useState<ModalProps | null>(null);

    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({});

    const [testCaseName, setTestCaseName] = useState('');
    const [editMode, setEditMode] = useState('');
    const [isTestCaseOpen, setIsTestCaseOpen] = useState(false);

    const isAddingTestCase = useMemo(() => !!testCases.find((c) => c.htmlInput), [testCases]);

    const hasTestCase = useMemo(() => testCases.some((c) => !c.htmlInput) , [testCases]);

    const [showTestCaseMenu, toggleTestCaseMenu] = useDialog();

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const updateTestCase = (recipe: (draft: Draft<TestCase[]>) => void) => {
        setTestCases(produce(testCases, recipe));
    };

    const getAllTestSuitesTags = useCallback( (async () => {
        const runTagTestSuites = await unitTestService.getAllTestSuitesTags();
        setRunTags((prevState) => ({
            ...prevState,
            tag: runTagTestSuites
        }))
    }), []);

    useEffect(() => {
        fetchTestTypes();
        fetchTestReport();
        if(!showTestCaseMenu) {
            toggleTestCaseMenu();
        }
    }, []);


    useEffect(() => {
        if (tab) {
          prefillFromTab();
        }
    }, [tabId]);

    useEffect(() => {
        refetchAll(entityType, '', unitTestGuid);
    }, [refreshSidebar, confirmDeleteDialog]);

    useEffect(() => {
        getAllTestSuitesTags();
    }, [tags.tag, getAllTestSuitesTags]);

    const prefillFromTab = async () => {
        const { data } = tab;
        if (data instanceof EntityInformation) {
            refetchAll(brToEntityType(data.entityType, data.typeCode), data.oipaRule.ruleGuid);
        } else if (data instanceof TestReport) {
            if (['TEST_SUITE', 'TEST_SUITES'].includes(data.report.type)) {
                setEntityType(data.getType());
                setUnitTestGuid(data.unitTestGuid);
            } else {
                reset();
            }
        } else if (data instanceof InterpreterSession) {
            refetchAll(data.oipaRule.entityType, data.oipaRule.ruleGuid, data.testSuite.unitTestGuid);
        } else {
            reset();
        }
    };

    const reset = () => {
        setEntityType('');
        setUnitTestGuid('');
        setTestCases([]);
    };

    const refetchAll = load(async (e: EntityType, rule: string, testGuid?: string) => {
        getAllTestSuitesTags();

        const newTypes = await unitTestService.getTestTypesWithCoverage();

        setTypesWithCoverage(newTypes);

        if (e) {
            const newType = newTypes.find((t) => e.toUpperCase() === t.entityType.toUpperCase());
            const newEntityType = newType?.entityType;
            setEntityType(newEntityType ?? '');

            if (newEntityType) {
                const newTestSuites = await unitTestService.getTestSuites(newEntityType);
                setSuites(newTestSuites);

                let uTestGuid = testGuid;

                if (!testGuid && rule) {
                    const suite = newTestSuites.find((s) => s.ruleGuid === rule);
                    uTestGuid = suite?.unitTestGuid;
                }

                setSuiteTagState(newTestSuites, uTestGuid);

                setUnitTestGuid(uTestGuid ?? '');
                if (uTestGuid) {
                    const newCases = await unitTestService.getTestCases(newEntityType, uTestGuid);
                    setTestCases(newCases);
                }
            }
        }
    });

    const fetchTestTypes = load(async () => {
        const newTypes = await unitTestService.getTestTypes();
        setTypes(newTypes);
    });

    const handleTestTypeChange = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        const newEntityType = e.target.value as EntityType;
        setEntityType(newEntityType);
        setIsTestCaseOpen(false);
        if (newEntityType === '') {
            setSuites([]);
        } else {
            const newTestSuites = await unitTestService.getTestSuites(newEntityType);
            setSuites(newTestSuites);
        }
        setTestCases([]);
        closeRightbar();
    });

    const handleSuiteChange = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        const newUnitTestGuid = e.target.value;
        if (newUnitTestGuid === '') {
            setTestCases([]);
            setIsTestCaseOpen(false);
        } else {
            const newCases = await unitTestService.getTestCases(entityType, newUnitTestGuid);
            setTestCases(newCases);
            setIsTestCaseOpen(true);
        }
        setUnitTestGuid(newUnitTestGuid);
        closeRightbar();

        setSuiteTagState(suites, newUnitTestGuid);
    });

    const currentType = typesWithCoverage.find((t) => t.entityType === entityType);
    const currentSuite = suites.find((s) => s.unitTestGuid === unitTestGuid);

    const getTestCaseColor = (c: TestCase) => {
        switch (c.lastResult) {
            case 'COMPILATION_FAILURE':
            case 'NOT_EXECUTED':
                return 'orange';
            case 'FAILURE':
                return 'red';
            case 'SUCCESS':
                return 'green';
            case "NO_TEST_CASE":
                return "blue";
        }
    };

    const fetchTestReport = () => {
        load(async () => unitTestService.getAllTestReport())().then(setTestReport);
    }

    const runAllTests = load(async (_: MouseEvent) => {
        const xmlReport = await (runTags.inputValue ? unitTestService.runAllTestsWithTags(new RunTestSuiteRequest(runTags.inputValue)) : unitTestService.runAllTests());
        const data = new TestReport();
        data.report = xmlReport;
        data.entityType = entityType;
        data.unitTestGuid = unitTestGuid;
        dispatch({ type: OPEN, payload: { data, reloadContent: true } });
        fetchTestReport();
    });

    const runTestSuite = load(async (_: MouseEvent) => {
        const xmlReport = await unitTestService.runTestSuite(entityType, unitTestGuid);
        const data = new TestReport();
        data.report = xmlReport;
        data.entityType = entityType;
        data.unitTestGuid = unitTestGuid;
        dispatch({ type: OPEN, payload: { data, reloadContent: true } });
        fetchTestReport();
    });

    const openDialog = (children: JSX.Element, onConfirm: () => void) => {
        setDialogProps({
            children,
            confirmButton: { onConfirm },
        });
        openModal();
    };

    const deleteTestCase = load(async (c: TestCase) => {
        await unitTestService.deleteTestCase(c.entityType, unitTestGuid, c.name);
        setConfirmDeleteDialog(!confirmDeleteDialog);
        closeModal();
    });

    const getDialogProps = () : ModalProps => ({ ...dialogProps });

    const closeDialog = () => {
        closeModal();
        setDialogProps({});
    };

    const openTestCase = (tc: TestCase) =>
        load(async (e: MouseEvent) => {
            e.preventDefault();

            const interEntityType = toEntityType(tc.entityType, true);
            const editorInformation = await debuggerEntitiesService.getInterpreterEditorInformation(
                tc.ruleGuid,
                interEntityType,
            );
            const entityInformation = await entityInformationService.getEntityInformation(
                editorInformation.entityType,
                editorInformation.guid,
                'XML_DATA',
            );

            const data = entityInformation.createInterpreterData(tc.ruleGuid, tc.entityType);
            data.form = data.createBasicForm(new DebuggerForm(), []);
            data.testSuite = currentSuite ?? new TestSuite();
            data.form.entity = tc.context;
            data.form.entityLevel = tc.level;
            data.testCase = tc;
            data.useTestCase = true;

            // dispose Debug component
            dispatch({ type: MONACO_DISPOSE, payload: { tabId, layoutId } });

            dispatch({ type: OPEN, payload: { data, hidden: true } });

            // do not try to open the tab if it's already opened
            if(tabId !== entityInformation.generateTabId()){
                entityInformation.interpreterOpened = true;
                dispatch({ type: OPEN, payload: { data: entityInformation } });
            }
        });

    const components = {
        DropdownIndicator: null,
    };

    const setSuiteTagState = (testSuites: TestSuite[], guid: string | undefined) => {
        const suiteTag = testSuites.find((s) => s.unitTestGuid === guid);
        setTags({
            ...tags,
            entityType,
            unitTestGuid: suiteTag?.unitTestGuid??'',
            tag: suiteTag?.tag??[]
        })
    }

    const handleRunTagChange = (value: any) => {
        const newValue = value !== null && value.length > 0 ? value.map((v: any) => v.value) : null;
        setRunTags({
            ...runTags,
            inputValue: newValue
        })
    }

    const handleTagChange = async (value: any) => {
        const newValue = value !== null ? value.map((v: any) => v.value) : [];
        await unitTestService.updateTag(tags.entityType, tags.unitTestGuid, newValue.length > 0 ? newValue : null);
        setTags({...tags, tag : newValue });
    };

    const handleTagInputChange = (inputValue: string) => {
        setTags({...tags, inputValue: inputValue });
    };

    const handleTagKeyDown = async (event: KeyboardEvent<HTMLElement>) => {
        const { inputValue, tag } = tags;

        if (!inputValue) return;

        const newTag = [...tag, inputValue];

        switch (event.key) {
            case 'Enter':
            case 'Tab':
                await unitTestService.updateTag(entityType, unitTestGuid, newTag);
                setTags({
                    ...tags,
                    inputValue: '',
                    tag: newTag
                });
                event.preventDefault();
        }
    };

    const testCaseNameInput = (value?: string) => {
        return <input type="text" autoFocus defaultValue={value}
                      onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                      }}
                      onChange={(e) => setTestCaseName(e.target.value)} />;
    }

    const renameTestCase = async (tc: TestCase) => {
        setEditMode('rename');
        setTestCaseName(tc.name);
        toggleTestCaseMenu();
        updateTestCase((draft) => {
            draft.forEach((s, index) => s.name === tc.name && (draft[index].htmlInput = testCaseNameInput(tc.name)));
        });
    }

    const duplicateTestCase = async (tc: TestCase) => {
        setEditMode('duplicate');
        const newTestNameCopy = tc.name + ' - Copy';
        setTestCaseName(newTestNameCopy);
        toggleTestCaseMenu();
        updateTestCase((draft) => {
            draft.push({...tc, htmlInput: testCaseNameInput(newTestNameCopy)})
        });
    }

    const createTestCase = async () => {
        setEditMode('create');
        setTestCaseName('');
        toggleTestCaseMenu();
        updateTestCase((draft) => {
            const tc = new TestCase();
            tc.htmlInput = testCaseNameInput('')
            draft.push(tc)
        });
    }

    const validateUnicityTestCaseName = () => {
        return testCases.find(f => f.name === testCaseName);
    }

    const submitTestCaseChange = async (tc: TestCase) => {

        if (!testCaseName) {
            const errorInformation: ErrorInformation = {
                message: 'TestCase name must be set',
                extraInformation: testCaseName
            };
            notifyError(errorInformation);
            return;
        }

        if (validateUnicityTestCaseName()) {
            const errorInformation: ErrorInformation = {
                message: 'TestCase name is not unique',
                extraInformation: testCaseName
            };
            notifyError(errorInformation);
            return;
        }

        if (editMode === 'rename') {
            await unitTestService.renameTestCase(entityType, unitTestGuid, tc.name, testCaseName);
            updateTestCase((draft) => {
                draft.forEach((s, index) => {
                    if (s.name === tc.name) {
                        draft[index].htmlInput = null;
                        draft[index].name = testCaseName;
                    }
                });
            });
        } else if (editMode === 'duplicate') {
            await unitTestService.duplicateTestCase(entityType, unitTestGuid, tc.name, testCaseName);
            updateTestCase((draft) => {
                draft[draft.length - 1].htmlInput = null;
                draft[draft.length - 1].name = testCaseName;
            });
        } else if (editMode === 'create') {
            await unitTestService.createTestCase(testCaseName, entityType, unitTestGuid);
            updateTestCase((draft) => {
                draft[draft.length - 1].htmlInput = null;
                draft[draft.length - 1].name = testCaseName;
            });
        }

        setTestCaseName('');
        refetchAll(entityType, '', unitTestGuid);
        toggleTestCaseMenu();
    }

    const cancelTestCaseChange = async (tc: TestCase) => {
        if (editMode === 'rename') {
            updateTestCase((draft) => {
                draft.forEach((s, index) => {
                    if (s.name === tc.name) {
                        draft[index].htmlInput = null;
                    }
                });
            });
        } else if (editMode === 'duplicate' || editMode === 'create') {
            updateTestCase((draft) => {
                draft.pop()
            });
        }

        setTestCaseName('');
        toggleTestCaseMenu();
    }

    const openReport = (report: TestReportResult) => {
        const data = new TestReport();
        data.report = report.testResult;
        data.entityType = entityType;
        data.unitTestGuid = unitTestGuid;
        data.unitTestReportGuid = report.unitTestReportGuid;
        data.runBy = report.runBy;
        data.runDate = report.runDate;
        dispatch({ type: OPEN, payload: { data } });
    }

    const actionBar = (c: TestCase) => {
        return (showTestCaseMenu) ? <ActionNav>
                <ActionNavItem>
                    <NavItem>{'...'}</NavItem>
                    <ul>
                        <li>
                            <ActionNavButton onClick={(e) => {
                                e.preventDefault();
                                renameTestCase(c);
                            }} title="Rename" />
                        </li>
                        <li>
                            <ActionNavButton onClick={(e) => {
                                e.preventDefault();
                                duplicateTestCase(c);
                            }} title="Duplicate" />
                        </li>
                        <li>
                            <ActionNavButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openDialog(
                                        <>
                                            <Loading loading={loading} />
                                            <div>
                                                Are you sure you want to <strong>delete</strong> this test case?
                                                <br />
                                                <b>{`- ${c.name}`}</b>
                                            </div>
                                        </>,
                                        () => deleteTestCase(c)
                                    );
                                }}
                                title='Delete'
                            />
                        </li>
                    </ul>
                </ActionNavItem>
            </ActionNav>
            : (c?.htmlInput) ?
                <>
                    <RightButton type="submit" buttonType="tertiary" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        submitTestCaseChange(c);
                    }}>
                        <CheckIcon/>
                    </RightButton>
                    <RightButton buttonType="tertiary" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        cancelTestCaseChange(c)
                    }}>
                        <CancelIcon/>
                    </RightButton>
                </>
                : <></>;
    }

    return (
        <>
            <PanelTitle>Unit test</PanelTitle>
            <div>
                <Loading loading={loading} />
            </div>

            <CollapseContainer
                title='Test Suite Explorer'
                actions={
                    <div onClick={(e) => e.stopPropagation()} title='Add test suite'>
                        <Button
                                type="button"
                                buttonType="tertiary"
                                onClick={(e: MouseEvent) => {
                                    e.preventDefault();
                                    openRightbar('Create_Test_Suite', { entityType });
                                }}
                                disabled={!entityType}
                            >
                            + Add
                        </Button>
                    </div>
                }
                defaultOpened
            >
                <UnitTestContainer>
                    <UnitTestSection>
                        <Select
                            label="Entity type:"
                            value={entityType}
                            onChange={handleTestTypeChange}
                            emptySelectText="Select One"
                            options={types.map((t) => ({ label: t, value: t }))}
                        />
                    </UnitTestSection>

                    {currentType && (
                        <CoverageSection>
                            <span>
                                <b>Test suites:</b> {currentType.produceString()}
                            </span>
                            <span>
                                <b>Code coverage:</b> {currentType.totalPercent}%
                            </span>
                        </CoverageSection>
                    )}

                    {entityType && (
                        <UnitTestSection>
                            <Select
                                label="Test Suites:"
                                value={unitTestGuid}
                                onChange={handleSuiteChange}
                                emptySelectText="Select One"
                                options={suites.map((s) => ({
                                    label: s.ruleName + ' (' + s.override + ')',
                                    value: s.unitTestGuid,
                                }))}
                            />

                        </UnitTestSection>)}

                    {currentSuite && (
                        <>
                            <CoverageSection>
                                <b>Covered Lines:</b> {currentSuite.coverage?.produceString() ?? 'N/A'}
                            </CoverageSection>
                            <div>
                                <span>Tags:</span>
                                <Creatable
                                    components={components}
                                    inputValue={tags.inputValue}
                                    isClearable
                                    isMulti
                                    menuIsOpen={false}
                                    onChange={handleTagChange}
                                    onInputChange={handleTagInputChange}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder="Tag"
                                    value={tags.tag.map((value) => ({
                                        label: value,
                                        value
                                    }))}
                                />
                            </div>
                            <RunTestSuiteButton
                                type="button"
                                buttonType="secondary"
                                onClick={runTestSuite}
                                disabled={!hasTestCase || loading}
                            >
                                Run Test Suite
                            </RunTestSuiteButton>
                        </>
                    )}
                </UnitTestContainer>
            </CollapseContainer>

            <CollapseContainer
                title='Test Cases'
                open={isTestCaseOpen}
                actions={<div onClick={(e) => e.stopPropagation()} title='Add test case'>
                            <Button
                                type="button"
                                buttonType="tertiary"
                                onClick={(e : MouseEvent) => {
                                    e.preventDefault();
                                    createTestCase();
                                }}
                                disabled={ isAddingTestCase || !entityType || !unitTestGuid }
                            >
                                + Add
                            </Button>
                        </div>}
            >
                <UnitTestContainer>
                    {entityType && unitTestGuid && testCases.length > 0 ? (
                        <TestCaseList id="TestCaseList">
                            {testCases.map((c) => (
                                <li key={c.name}>
                                    <div className={!c.htmlInput ? 'open-test-case' : '' }
                                         onClick={ !c.htmlInput ? openTestCase(c) : undefined}
                                    >
                                        <UnitTestIcon color={getTestCaseColor(c)} />
                                        <span>{c.htmlInput || c.name}</span>
                                    </div>
                                    <div>
                                        {actionBar(c)}
                                    </div>
                                </li>
                            ))}
                        </TestCaseList>
                    )
                    :
                    (!entityType || !unitTestGuid) ? <span>No record, choose a test suite first</span>
                        : <span>No records found.</span>
                    }
                </UnitTestContainer>
            </CollapseContainer>

            <CollapseContainer title='Run'>
                <UnitTestContainer>
                    <UnitTestRunSection>
                        <span>Tags</span>
                        <SelectMulti
                            name='Tags'
                            closeMenuOnSelect={false}
                            placeholder="All"
                            options={runTags.tag.map((value) => ({ label: value, value }))}
                            isMulti
                            onChange={handleRunTagChange}
                        />
                    </UnitTestRunSection>

                    <Button buttonType="primary" onClick={runAllTests} disabled={loading}>
                        Run
                    </Button>
                </UnitTestContainer>
            </CollapseContainer>

            <DataGridWrapper>
                <CollapseContainer title='Reports'>
                    <ReportsContent
                        testReport={testReport}
                        onClickItem={openReport}
                    />
                </CollapseContainer>
            </DataGridWrapper>
           <ModalDialog
               {...getDialogProps()}
               isOpen={isModalOpen}
               onRequestClose={closeDialog}
               title='Confirmation Required'
           />
        </>
    );
};

UnitTestPanel.defaultProps = {
    unitTestService: defaultUnitTestService,
    entityInformationService: defaultEntityInformationService,
    debuggerEntitiesService: defaultDebuggerEntitiesService,
};

export default UnitTestPanel;
