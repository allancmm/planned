import { Switch } from '@material-ui/core';
import { CreateSelect, ListWithDropdownOverflow, Loading, useLoading } from 'equisoft-design-ui-elements';
import produce, { Draft } from 'immer';
import React, { ChangeEvent, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Layout } from 'react-feather';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { TabContext, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { SplitButton, TabButton, Tabs } from '../../../components/editor/tabs/tabList/style';
import { EDIT_TAB_DATA, MONACO_DISPOSE, OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { Options } from '../../../components/general/inputText';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import {
    defaultDebuggerEntitiesService,
    defaultInterpreterService,
    defaultUnitTestService,
} from '../../../lib/context';
import AssessmentDto from '../../../lib/domain/entities/assessmentDto';
import CreateTestCase from '../../../lib/domain/entities/createTestCase';
import DebuggerEntity from '../../../lib/domain/entities/debuggerEntity';
import DebuggerForm from '../../../lib/domain/entities/debuggerForm';
import DebuggerParameters from '../../../lib/domain/entities/debuggerParameters';
import InterpreterResult from '../../../lib/domain/entities/interpreterResult';
import MockDto from '../../../lib/domain/entities/mockDto';
import MultifieldItem from '../../../lib/domain/entities/multifieldItem';
import ParameterItem from '../../../lib/domain/entities/parameterItem';
import DebuggerDataDocument from '../../../lib/domain/entities/sidebarData/debuggerData';
import InterpreterSession from '../../../lib/domain/entities/tabData/interpreterSession';
import TestDataResultDto from '../../../lib/domain/entities/testDataResultDto';
import { EntityLevel } from '../../../lib/domain/enums/entityLevel';
import { EntityType } from '../../../lib/domain/enums/entityType';
import DebuggerEntitiesService from '../../../lib/services/debuggerEntitiesService';
import InterpreterService from '../../../lib/services/interpreterService';
import UnitTestService from '../../../lib/services/unitTestService';
import EntityContextSelector from '../debugger/entityContextSelector';
import EntityParametersSelector from '../debugger/entityParametersSelector';
import formLayout from '../debugger/form';
import TableDataTab from '../debugger/tableDataTab';
import MonacoContainer from '../monaco/monaco';
import { InterpreterActions } from './style';

const interpreterTabs = ['Context', 'Parameters', 'Test Data', 'Results'] as const;
type InterpreterType = typeof interpreterTabs[number];

interface InterpreterProps {
    tabId: string;
    layoutId: number;
    instance?: number;

    debuggerEntitiesService: DebuggerEntitiesService;
    interpreterService: InterpreterService;
    unitTestService: UnitTestService;
}

const DEFAULT_PARAM_LOCATION = 0;
const DEFAULT_ASSESSMENT_LOCATION = 2;

const Interpreter = ({
    tabId,
    layoutId,
    instance = 0,
    debuggerEntitiesService,
    interpreterService,
    unitTestService,
}: InterpreterProps) => {
    const {
        state: { focusLayout },
        dispatch,
    } = useContext(TabContext);
    const { model, data, name } = useTabWithId(tabId);
    const [tabs, setTabs] = useState<InterpreterType[]>(['Context', 'Parameters', 'Test Data', 'Results']);
    const [supportsTesting, setSupportsTesting] = useState(false);
    const { toggleRefreshSidebar, getDataForSidebar } = useContext(SidebarContext);
    const [defaultMultifieldsList, setDefaultMultifieldsList] = useState<MultifieldItem[]>([]);
    const [defaultMultifieldsSource, setDefaultMultifieldsSource] = useState<string>('');
    const [xmlMode, setXmlMode] = useState<boolean>();
    const [xmlModeForTestData, setXmlModeForTestData] = useState<boolean>();

    const tab = useTabWithId(tabId);

    const [loading, load] = useLoading();

    const debuggerFormObject = new DebuggerForm();

    if (!(data instanceof InterpreterSession)) {
        toast(`Tab ${name} has invalid data`);
        return null;
    }

    useEffect(() => {
        let isMounted = true;

        supportsUnitTesting();

        if (model.length === 0 || model.reduce((i: boolean, m) => i && (m?.isDisposed() ?? false), true)) {
            if (data.useTestCase) {
                loadTestCase(data.testCase ? data.testCase.name : data.testSuite.cases[0]);
            } else {
                initInterpreter(isMounted);
            }
        }
        return () => {
            isMounted = false;
        };
    }, [data.useTestCase]);

    const initInterpreter = load(async (isMounted: boolean) => {
        const [paramsResp, defaultRulesResp] = await Promise.allSettled([
            debuggerEntitiesService
                .getParameters(
                    data.interpreterEntityType,
                    data.form?.entityLevel || '',
                    data.form?.entity?.guid ?? '',
                    data.interpreterRuleGuid,
                )
                .catch(() => new DebuggerParameters()),
            getDefaultContextRules(data.interpreterEntityType).catch(() => []),
        ]);

        if (isMounted) {
            editSession((draft) => {
                draft.useTestCase = false;
                if (!draft.form) {
                    draft.form = data.createBasicForm(
                        debuggerSidebarData.defaultContextForm,
                        defaultRulesResp.status === 'fulfilled' ? defaultRulesResp.value : [],
                    );
                }
                if (!draft.form.params.parametersXml) {
                    draft.form.params = paramsResp.status === 'fulfilled' ? paramsResp.value : new DebuggerParameters();
                }
            }, true);
            refreshMultifieldsData(paramsResp.status === 'fulfilled' ? paramsResp.value : new DebuggerParameters());
        }
    });

    useLayoutEffect(() => {
        let tbs = [...tabs];
        if (formLayout[data.interpreterEntityType].hasParameters) {
            if (!tbs.includes('Parameters')) tbs.splice(DEFAULT_PARAM_LOCATION, 0, 'Parameters');
        } else {
            tbs = tbs.filter((t) => t !== 'Parameters');
        }
        if (data.useTestCase) {
            if (!tbs.includes('Test Data')) tbs.splice(DEFAULT_ASSESSMENT_LOCATION, 0, 'Test Data');
        } else {
            tbs = tbs.filter((t) => t !== 'Test Data');
        }
        setTabs(tbs);
    }, [data.useTestCase, data.interpreterEntityType]);

    const debuggerSidebarData = getDataForSidebar('Debug') as DebuggerDataDocument;
    const getDefaultContextRules = load(async (et: EntityType) =>
        debuggerEntitiesService
            .getRules(
                et,
                debuggerSidebarData?.defaultContextForm.entityLevel,
                debuggerSidebarData?.defaultContextForm.entity?.guid ?? '',
            )
            .catch(() => []),
    );

    const changeItemPosition = (tabName: InterpreterType, newIndex: number) => {
        setTabActive(newIndex);
        setTabs(tabs.filter((t) => t === tabName).splice(newIndex, 0, tabName));
    };

    const setTabActive = async (index: number) => {
        const prevTab = tabs[data.active];
        // if no tab change do nothing
        const current = tabs[index];
        if (current !== prevTab) {
            switch (prevTab) {
                case 'Parameters':
                    if (xmlMode) {
                        const xml = xmlMode && !model[0]?.isDisposed() ? model[0]?.getValue() ?? '' : '';

                        const listFetchInit = await debuggerEntitiesService.getParametersTableFromXML(
                            xml,
                            data.interpreterEntityType,
                        );

                        if (!data.useTestCase) {
                            editSession((draft) => {
                                if (draft.form) {
                                    draft.form.params.parametersXml = xml;
                                    draft.form.params = listFetchInit;
                                }
                            });
                        } else if (data.testCase) {
                            data.testCase.parameters = xml;
                            data.testCase.multifieldsIndex = listFetchInit.multifieldsIndex;
                            data.testCase.parametersTable = listFetchInit.parametersTable;
                        }
                    }

                    dispatch({
                        type: MONACO_DISPOSE,
                        payload: { layoutId, instances: [instance], tabId },
                    });
                    break;
                case 'Test Data':
                    if (data.useTestCase) {
                        if (xmlModeForTestData && data.testCase) {
                            const xml = !model[1]?.isDisposed() ? model[1]?.getValue() ?? '' : '';
                            if (xml !== '') {
                                const newTablesData = await unitTestService
                                    .generateMocksTables(xml)
                                    .catch(() => new TestDataResultDto());

                                newTablesData.mocks.forEach((d) => (d.rowID = uuid()));
                                newTablesData.assessments.forEach((d) => (d.rowID = uuid()));
                                data.testCase.testData = xml;
                                data.testCase.testDataTable = newTablesData;
                            }
                        }
                    }
                    dispatch({
                        type: MONACO_DISPOSE,
                        payload: { layoutId, instances: [instance], tabId },
                    });
                    break;
                case 'Results':
                    dispatch({
                        type: MONACO_DISPOSE,
                        payload: { layoutId, instances: [instance], tabId },
                    });
                    break;
            }

            editSession((draft) => {
                draft.active = index;
            }, true);
        }
    };

    const popOutInterpreter = () => {
        data.standalone = true;
        dispatch({ type: OPEN, payload: { data } });
    };

    const editSession = (
        recipe: (draft: Draft<InterpreterSession>) => void,
        dispose: boolean = false,
        baseData: InterpreterSession = data,
    ) => {
        const newData = produce(baseData, recipe);
        dispatch({
            type: MONACO_DISPOSE,
            payload: { layoutId, instances: [instance], dispose: dispose ? 'all' : [], tabId },
        });
        dispatch({ type: EDIT_TAB_DATA, payload: { tabId, data: newData } });
        return newData;
    };

    const saveTestCase = load(async () => {
        if (data.useTestCase && data.testCase) {
            const entityLevel = data.form?.entityLevel ?? '';
            const params =
                xmlMode && !model[0]?.isDisposed()
                    ? tab.model[0]?.getValue() ?? ''
                    : await debuggerEntitiesService
                          .getParametersXmlFromTable(
                              data.interpreterEntityType,
                              data.testCase.parametersTable,
                              data.testCase.multifieldsIndex,
                          )
                          .catch(() => '');
            const listFetchInit = await debuggerEntitiesService.getParametersTableFromXML(
                params,
                data.interpreterEntityType,
            );

            // used if we are in table mode
            const convertXml = await unitTestService
                .generateMocksIntoXml(data.testCase.testDataTable.assessments, data.testCase.testDataTable.mocks)
                .catch(() => new TestDataResultDto());

            const testData =
                xmlModeForTestData && !model[1]?.isDisposed() ? tab.model[1]?.getValue() ?? '' : convertXml.xmlResult;

            // if we are in xml mode we have to update tables after saving  and give theme uuid:
            const newTablesData = await unitTestService
                .generateMocksTables(testData)
                .catch(() => new TestDataResultDto());

            newTablesData.mocks.forEach((d) => (d.rowID = uuid()));
            newTablesData.assessments.forEach((d) => (d.rowID = uuid()));

            const entity = data.form?.entity ?? new DebuggerEntity();

            const testCase = new CreateTestCase();
            testCase.parameters = params;
            testCase.testData = testData;
            testCase.section = data.testCase.section;
            testCase.level = entityLevel;
            testCase.context = entity;

            await unitTestService.saveTestCase(
                data.testCase.name,
                data.oipaRule.entityType,
                data.testSuite.unitTestGuid,
                testCase,
            );

            toggleRefreshSidebar();

            toast('Test case saved');
            return editSession((draft) => {
                if (draft.testCase) {
                    draft.testCase.parameters = params;
                    draft.testCase.testData = testData;
                    draft.testCase.testDataTable = newTablesData;
                    draft.testCase.parametersTable = listFetchInit.parametersTable;
                    draft.testCase.multifieldsIndex = listFetchInit.multifieldsIndex;
                }
            });
        }
        return data;
    });

    const interpret = load(async () => {
        let result: InterpreterResult;
        const resultTab = tabs.indexOf('Results');

        if (data.useTestCase) {
            if (!data.testCase?.name) {
                toast.warn('No test case selected');
                return;
            }
            const updateData = await saveTestCase();
            result = await unitTestService.runTestCase(
                data.oipaRule.entityType,
                data.testSuite.unitTestGuid,
                data.testCase.name,
            );

            editSession(
                (draft) => {
                    draft.results = result;
                    draft.active = resultTab;
                },
                true,
                updateData,
            );
        } else if (data.form) {
            let params = '';
            if (data.form.entityType === 'AS_FILE') {
                params = !model[0]?.isDisposed() ? model[0]?.getValue() ?? '' : '';
                result = await interpreterService.interpretRule(data.form, params).catch(() => new InterpreterResult());
                editSession((draft) => {
                    if (draft.form?.params) {
                        draft.form.params.parametersXml = params;
                    }
                    draft.results = result;
                    draft.active = resultTab;
                }, true);
            } else {
                if (xmlMode) {
                    params = !model[0]?.isDisposed() ? model[0]?.getValue() ?? '' : '';
                    const listFetchInit = await debuggerEntitiesService.getParametersTableFromXML(
                        params,
                        data.interpreterEntityType,
                    );
                    result = await interpreterService
                        .interpretRule(data.form, params)
                        .catch(() => new InterpreterResult());

                    editSession((draft) => {
                        if (draft.form?.params) {
                            draft.form.params.parametersXml = params;
                            draft.form.params.parametersTable = listFetchInit.parametersTable;
                            draft.form.params.multifieldsIndex = listFetchInit.multifieldsIndex;
                        }
                        draft.results = result;
                        draft.active = resultTab;
                    }, true);
                } else {
                    params = await debuggerEntitiesService
                        .getParametersXmlFromTable(
                            data.interpreterEntityType,
                            data.form.params.parametersTable,
                            data.form.params.multifieldsIndex,
                        )
                        .catch(() => '');

                    result = await interpreterService
                        .interpretRule(data.form, params)
                        .catch(() => new InterpreterResult());

                    editSession((draft) => {
                        if (draft.form?.params) {
                            draft.form.params.parametersXml = params;
                        }
                        draft.results = result;
                        draft.active = resultTab;
                    }, true);
                }
            }
        }

        if (resultTab !== data.active) {
            dispatch({
                type: MONACO_DISPOSE,
                payload: { layoutId, instances: [instance], dispose: [resultTab], tabId },
            });
        }
    });

    const switchMode = (e: ChangeEvent<HTMLInputElement>) => {
        editSession((draft) => {
            draft.useTestCase = e.target.checked;
        }, true);
    };

    const supportsUnitTesting = load(async () => {
        if (data.oipaRule.entityType === 'BUSINESS_RULES' && data.interpreterEntityType === 'EXPOSED_COMPUTATION') {
            setSupportsTesting(false);
        } else {
            setSupportsTesting(await unitTestService.supportsTesting(data.interpreterEntityType));
        }
    });

    const loadTestCase = load(async (caseName: string) => {
        if (caseName) {
            const newCase = await unitTestService.loadTestCase(
                data.interpreterEntityType,
                data.testSuite.unitTestGuid,
                caseName,
            );

            newCase.testDataTable.mocks.forEach((d) => (d.rowID = uuid()));
            newCase.testDataTable.assessments.forEach((d) => (d.rowID = uuid()));
            const defaultMultiFieldsList =
                data.useTestCase && data.testCase
                    ? data.testCase.multifieldsIndex
                    : data.form?.params.multifieldsIndex ?? [];

            setDefaultMultifieldsList(defaultMultiFieldsList);

            // to make the default select in the parameters tab
            const defaultSource = defaultMultiFieldsList.at(0)?.sourceName;

            setDefaultMultifieldsSource(defaultSource || '');

            editSession((draft) => {
                draft.testCase = newCase;
                draft.useTestCase = true;
                draft.testCase.multifieldsIndex = newCase.multifieldsIndex;
                draft.testCase.parametersTable = newCase.parametersTable;
                if (draft.form) {
                    draft.form.entity = newCase.context;
                    draft.form.entityLevel = newCase.level;
                }
            }, true);
            toggleRefreshSidebar();
        }
    });

    const handleEntityChange = load(async (val: DebuggerEntity) => {
        if (data.form) {
            const { entityType, entityLevel } = data.form;
            const newRules = await debuggerEntitiesService.getRules(entityType, entityLevel, val.guid).catch(() => []);
            const newParametersData = data.interpreterRuleGuid
                ? await debuggerEntitiesService
                      .getParameters(entityType, entityLevel, val.guid, data.interpreterRuleGuid)
                      .catch(() => new DebuggerParameters())
                : new DebuggerParameters();
            const breaksSession = !newRules.find((r) => r.value === data.interpreterRuleGuid);
            if (breaksSession) {
                toast.warning('Rule cannot be interpreted in this context');
            } else {
                editSession((draft) => {
                    if (draft.form) {
                        draft.form.entity = val;
                        if (!data.useTestCase) {
                            draft.form.params = newParametersData;
                        }
                    }
                }, true);
                refreshMultifieldsData(newParametersData);

                toggleRefreshSidebar();
            }
        }
    });

    const refreshMultifieldsData = (newPrameters: DebuggerParameters) => {
        const result = newPrameters.multifieldsIndex;

        setDefaultMultifieldsList(result);
        const defaultSource = newPrameters.multifieldsIndex.at(0)?.sourceName;
        setDefaultMultifieldsSource(defaultSource || '');
    };

    const handleParameterChange = load(async (newPrameters: ParameterItem[]) => {
        if (data.testCase) {
            editSession((draft) => {
                if (draft.testCase) {
                    draft.testCase.parametersTable = newPrameters;
                }
            }, true);
        } else if (data.form) {
            editSession((draft) => {
                if (draft.form) {
                    draft.form.params.parametersTable = newPrameters;
                }
            }, true);
        }
        toggleRefreshSidebar();
    });

    const handleParametersChangeXMLFormat = load(async (newPrameters: DebuggerParameters) => {
        if (data.form) {
            editSession((draft) => {
                if (draft.form) {
                    draft.form.params = newPrameters;
                }
            }, true);
        }
        toggleRefreshSidebar();
    });

    const onMultifieldParameterChange = load(async (newPrameters: ParameterItem[], source: string) => {
        if (data.testCase) {
            editSession((draft) => {
                if (draft.testCase) {
                    const element = draft.testCase.multifieldsIndex.find((c) => c.sourceName === source);
                    if (element) {
                        element.parameterItemList = newPrameters;
                    }
                }
            }, true);
        } else if (data.form) {
            editSession((draft) => {
                if (draft.form) {
                    const element = draft.form.params.multifieldsIndex.find((c) => c.sourceName === source);
                    if (element) {
                        element.parameterItemList = newPrameters;
                    }
                }
            }, true);
        }

        toggleRefreshSidebar();
    });

    const onDefaultSourceChange = (newSource: string) => {
        setDefaultMultifieldsSource(newSource);
    };

    const handleIndexChange = load(async (newPrameters: MultifieldItem[]) => {
        if (data.testCase) {
            editSession((draft) => {
                if (draft.testCase) {
                    draft.testCase.multifieldsIndex = newPrameters;
                }
            }, true);
        } else if (data.form) {
            editSession((draft) => {
                if (draft.form) {
                    draft.form.params.multifieldsIndex = newPrameters;
                }
            }, true);
        }
        toggleRefreshSidebar();
    });

    const handelXMLMode = load(async (newParams: string) => {
        if (data.form) {
            editSession((draft) => {
                if (draft.useTestCase && draft.testCase) {
                    draft.testCase.parameters = newParams;
                } else if (draft.form?.params) {
                    draft.form.params.parametersXml = newParams;
                }
            }, true);
        }
        toggleRefreshSidebar();
    });

    const handelAssessmentChange = async (newAssessment: AssessmentDto[]) => {
        if (data.testCase) {
            editSession((draft) => {
                if (draft.testCase) {
                    draft.testCase.testDataTable.assessments = newAssessment;
                }
            }, true);
        }
        toggleRefreshSidebar();
    };

    const handelMocksChange = async (newMocks: MockDto[]) => {
        if (data.testCase) {
            editSession((draft) => {
                if (draft.testCase) {
                    draft.testCase.testDataTable.mocks = newMocks;
                }
            }, true);
        }
        toggleRefreshSidebar();
    };

    const handelTestDataChange = async (table: TestDataResultDto) => {
        if (data.testCase) {
            editSession((draft) => {
                if (draft.testCase) {
                    draft.testCase.testData = table.xmlResult;
                    draft.testCase.testDataTable = table;
                }
            }, true);
        }
        toggleRefreshSidebar();
    };

    const handelTableMode = async (newParams: DebuggerParameters) => {
        if (data.form) {
            editSession((draft) => {
                if (draft.useTestCase && draft.testCase) {
                    draft.testCase.parametersTable = newParams.parametersTable;
                    draft.testCase.multifieldsIndex = newParams.multifieldsIndex;
                    draft.testCase.parameters = newParams.parametersXml;
                } else if (draft.form?.params) {
                    draft.form.params.parametersTable = newParams.parametersTable;
                    draft.form.params.multifieldsIndex = newParams.multifieldsIndex;
                    draft.form.params.parametersXml = newParams.parametersXml;
                }
            }, true);
        }
        toggleRefreshSidebar();
    };

    const handleSelectEntityLevel = async (e: Options) => {
        if (data.form) {
            const newLevel = e.value as EntityLevel;
            const { entityType } = data.form;
            const newParametersData = data.interpreterRuleGuid
                ? await debuggerEntitiesService
                      .getParameters(entityType, newLevel, data.form?.entity?.guid ?? '', data.interpreterRuleGuid)
                      .catch(() => new DebuggerParameters())
                : new DebuggerParameters();

            editSession((draft) => {
                if (draft.form) {
                    draft.form.entityLevel = newLevel;
                    draft.form.entity = null;
                    if (!data.useTestCase) {
                        draft.form.params = newParametersData;
                    }
                }
            }, true);
            refreshMultifieldsData(newParametersData);
            toggleRefreshSidebar();
        }
    };

    const handleCreateTestCase = load(async (caseName: string) => {
        let params = '';
        if (xmlMode) {
            params = data.useTestCase && data.testCase ? data.testCase.parameters : tab.model[0]?.getValue() ?? '';
        } else {
            params = await debuggerEntitiesService
                .getParametersXmlFromTable(
                    data.interpreterEntityType,
                    data.useTestCase && data.testCase
                        ? data.testCase.parametersTable
                        : data.form?.params.parametersTable ?? [],
                    data.useTestCase && data.testCase
                        ? data.testCase.multifieldsIndex
                        : data.form?.params.multifieldsIndex ?? [],
                )
                .catch(() => '');
        }

        const unitTestGuid = !data.testSuite.unitTestGuid
            ? await unitTestService.createTestSuite(
                  data.interpreterEntityType,
                  data.interpreterRuleGuid,
                  data.oipaRule.ruleName,
              )
            : data.testSuite.unitTestGuid;

        await unitTestService.createTestCase(caseName, data.interpreterEntityType, unitTestGuid);

        const newSuite = await unitTestService.loadTestSuite(data.interpreterEntityType, unitTestGuid);
        const newCase = await unitTestService.loadTestCase(data.interpreterEntityType, unitTestGuid, caseName);
        newCase.parameters = params;

        newCase.parametersTable =
            data.useTestCase && data.testCase ? data.testCase.parametersTable : data.form?.params.parametersTable ?? [];

        const defaultMultiFieldsList =
            data.useTestCase && data.testCase
                ? data.testCase.multifieldsIndex
                : data.form?.params.multifieldsIndex ?? [];
        newCase.multifieldsIndex = defaultMultiFieldsList;

        setDefaultMultifieldsList(defaultMultiFieldsList);

        const defaultSource = defaultMultiFieldsList.at(0)?.sourceName;
        setDefaultMultifieldsSource(defaultSource || '');

        editSession((draft) => {
            draft.testSuite = newSuite;
            draft.testCase = newCase;
        }, true);
    });

    const handelAddAssessment = () => {
        editSession((draft) => {
            if (draft.testCase) {
                draft.testCase.testDataTable.assessments.push(new AssessmentDto());
            }
        }, true);
    };

    const handelAddMock = () => {
        editSession((draft) => {
            if (draft.testCase) {
                draft.testCase.testDataTable.mocks.push(new MockDto());
            }
        }, true);
    };

    const buildInterpreterTabs = () => {
        switch (tabs[data.active]) {
            case 'Parameters': {
                return (
                    <EntityParametersSelector
                        data={data}
                        handleParametersChange={handleParameterChange}
                        handleIndexChange={handleIndexChange}
                        handleMultifieldsParametersChange={onMultifieldParameterChange}
                        handleSourceChange={onDefaultSourceChange}
                        handelXMLMode={handelXMLMode}
                        handelTableMode={handelTableMode}
                        handleParametersChangeXMLFormat={handleParametersChangeXMLFormat}
                        interpreterEntityType={data.interpreterEntityType}
                        defaultMultifieldsList={defaultMultifieldsList}
                        defaultMultifieldsSource={defaultMultifieldsSource}
                        xmlMode={xmlMode}
                        tabId={tabId}
                        layoutId={layoutId}
                        instance={instance}
                    />
                );
            }
            case 'Context':
                return (
                    <EntityContextSelector
                        form={data.form ?? debuggerFormObject}
                        handleEntityChange={handleEntityChange}
                        handleSelectEntityLevel={handleSelectEntityLevel}
                    />
                );

            case 'Test Data': {
                return (
                    <TableDataTab
                        tabId={tabId}
                        layoutId={layoutId}
                        instance={instance}
                        data={data}
                        interpreterEntityType={data.interpreterEntityType}
                        xmlModeForTestData={xmlModeForTestData}
                        handleAssessmentsChange={handelAssessmentChange}
                        handelTestDataChange={handelTestDataChange}
                        handleMocksChange={handelMocksChange}
                        handelAddAssessment={handelAddAssessment}
                        handelAddMock={handelAddMock}
                    />
                );
            }
            case 'Results': {
                return (
                    <MonacoContainer
                        tabId={tabId}
                        layoutId={layoutId}
                        instance={instance}
                        modelInstance={3}
                        readOnly
                        defaultValue={data.results?.combinedDocument}
                    />
                );
            }
        }
    };
    return (
        <>
            <Tabs>
                <ListWithDropdownOverflow
                    changeItemPosition={changeItemPosition}
                    active={tabs[data.active]}
                    alwaysShowButton={false}
                >
                    {tabs.map((t, i) => (
                        <TabButton
                            key={t}
                            focus={layoutId === focusLayout}
                            show={i === data.active}
                            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                            onClick={() => !loading && setTabActive(i)}
                            title={t}
                        >
                            {t}
                        </TabButton>
                    ))}
                </ListWithDropdownOverflow>
                <InterpreterActions>
                    {tabs[data.active] !== 'Context' &&
                        tabs[data.active] === 'Parameters' &&
                        data.form?.entityType !== 'AS_FILE' && (
                            <label>
                                Show parameters in XML mode:
                                <Switch
                                    checked={xmlMode}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                        setXmlMode(event.target.checked)
                                    }
                                    name="insertSwitch"
                                    color="primary"
                                />
                            </label>
                        )}
                    {supportsTesting && (
                        <>
                            {tabs[data.active] !== 'Context' && tabs[data.active] === 'Test Data' && (
                                <label>
                                    Show Test Data in XML mode:
                                    <Switch
                                        checked={xmlModeForTestData}
                                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                            setXmlModeForTestData(event.target.checked)
                                        }
                                        name="insertSwitch"
                                        color="primary"
                                    />
                                </label>
                            )}
                            <label>
                                Use test case:
                                <input type="checkbox" checked={data.useTestCase} onChange={switchMode} />
                            </label>
                            {data.useTestCase && (
                                <CreateSelect
                                    placeholder="Create or select Test Case..."
                                    onChange={(c) => loadTestCase(c.value)}
                                    isValidNewOption={(inputValue, _, options) =>
                                        !!inputValue && !options.some((tc) => tc === inputValue)
                                    }
                                    onCreateOption={handleCreateTestCase}
                                    getNewOptionData={(inputValue) => ({
                                        label: `Create new case: "${inputValue}"`,
                                        value: inputValue,
                                    })}
                                    getOptionLabel={(c) => c.label}
                                    getOptionValue={(c) => c.value}
                                    options={data.testSuite.cases.map((c) => ({ label: c, value: c }))}
                                    value={{
                                        label: data.testCase?.name,
                                        value: data.testCase?.name,
                                    }}
                                />
                            )}
                        </>
                    )}
                    {data.useTestCase && <button onClick={saveTestCase}>Save</button>}
                    <div
                        style={{
                            width: '1px',
                            height: '24px',
                            background: 'black',
                            marginLeft: '8px',
                            marginRight: '16px',
                        }}
                    />
                    <button onClick={interpret} className="run">
                        Run
                    </button>
                </InterpreterActions>
                {focusLayout === layoutId && !data.standalone && (
                    <SplitButton onClick={popOutInterpreter}>
                        <Layout />
                    </SplitButton>
                )}
            </Tabs>
            <Loading loading={loading} />

            {buildInterpreterTabs()}
        </>
    );
};

Interpreter.defaultProps = {
    debuggerEntitiesService: defaultDebuggerEntitiesService,
    interpreterService: defaultInterpreterService,
    unitTestService: defaultUnitTestService,
};

export default Interpreter;
