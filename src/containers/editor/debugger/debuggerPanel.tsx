import { CollapseContainer, Loading, useLoading } from 'equisoft-design-ui-elements';
import produce, { Draft } from 'immer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    TabContext,
    useFocusedActiveTab,
    useTabActions,
    useTabWithId,
} from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA, MONACO_DISPOSE, TabItem } from '../../../components/editor/tabs/tabReducerTypes';
import { EntitySummaryList } from '../../../components/general/sidebar/entitySummary/entitySummaryList';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { PanelTitle } from '../../../components/general/sidebar/style';
import { defaultDebuggerEntitiesService } from '../../../lib/context';
import DebuggerForm from '../../../lib/domain/entities/debuggerForm';
import DebuggerParameters from '../../../lib/domain/entities/debuggerParameters';
import DebuggerDataDocument from '../../../lib/domain/entities/sidebarData/debuggerData';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import InterpreterSession from '../../../lib/domain/entities/tabData/interpreterSession';
import TestReport from '../../../lib/domain/entities/tabData/testReport';
import { brToEntityType, EntityType, toEntityType } from '../../../lib/domain/enums/entityType';
import DebuggerEntitiesService from '../../../lib/services/debuggerEntitiesService';
import DebugSessionInfo from './debugSessionInfo';
import DefaultContext from './defaultContext';
import formLayout from './form';
import { NewDebugButton, OpenInterpreterContainer } from './style';

interface NewDebuggerFormProps {
    debuggerEntitiesService: DebuggerEntitiesService;
}

const DebuggerPanel = ({ debuggerEntitiesService }: NewDebuggerFormProps) => {
    const [layoutId, tabId] = useFocusedActiveTab();
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);
    const { refreshSidebar, data } = useContext(SidebarContext);

    if (!(data instanceof DebuggerDataDocument)) {
        return null;
    }

    const {
        state: { tabs },
    } = useContext(TabContext);
    const newDebug = useRef(true);
    const [loading, load] = useLoading();

    const extractFormFromSession = load(
        async (d: InterpreterSession): Promise<DebuggerForm> => {
            if (!d.form) {
                const defaultRules = await getDefaultContextRules(d.interpreterEntityType);
                return d.createBasicForm(data.defaultContextForm, defaultRules);
            }
            return d.form;
        },
    );

    const getDefaultContextRules = load(async (et: EntityType) =>
        debuggerEntitiesService
            .getRules(et, data.defaultContextForm.entityLevel, data.defaultContextForm.entity?.guid ?? '')
            .catch(() => []),
    );

    let interData: InterpreterSession | null = null;
    if (tab?.data instanceof EntityInformation) {
        const interID = tab?.data.generateInterpreterTabId();
        if (tabs[interID]) {
            interData = tabs[interID].data as InterpreterSession;
        }
    } else if (tab?.data instanceof InterpreterSession) {
        interData = tab?.data;
    }

    // Builds debugger form from the data of the currently opened tab.
    const getSessionData = load(
        async (): Promise<DebuggerForm> => {
            const d = tab?.data;
            const form: DebuggerForm = new DebuggerForm();
            if (d instanceof EntityInformation) {
                const interID = d.generateInterpreterTabId(); // if the current tab has a related interpreter session associated to it
                if (tabs[interID]) {
                    newDebug.current = false;
                    return extractFormFromSession(tabs[interID].data as InterpreterSession);
                }

                const newEntityType = brToEntityType(d.entityType, d.typeCode);

                if (formLayout[newEntityType]) {
                    form.entityType = newEntityType;

                    form.ruleGuid = d.oipaRule.ruleGuid;
                    form.rules = await getDefaultContextRules(newEntityType).catch(() => []);

                    InterpreterSession.tryAddDefaultContextToForm(form, data.defaultContextForm);
                    if (form.entityLevel === 'NONE') {
                        // in the case where the default context gets back to NONE, put the rule as the only entry in the dropdown, otherwise it will be included already
                        form.rules = [{ value: d.oipaRule.ruleGuid, name: d.oipaRule.ruleName }];
                    }

                    form.params = await debuggerEntitiesService
                        .getParameters(newEntityType, entityLevel, entity?.guid ?? '', d.oipaRule.ruleGuid)
                        .catch(() => new DebuggerParameters());
                    editForm(() => {}, true); // dispose monaco for params
                }

                return form;
            } else if (d instanceof TestReport) {
                const { report } = d;

                return report.type === 'TEST_SUITE'
                    ? produce(form, async (draft) => {
                          // TODO: Load context from unit test report
                          const newEntityType = toEntityType(report.packageName);

                          if (formLayout[newEntityType]) {
                              draft.entityType = newEntityType;
                              const nameParts = report.name.split('(');
                              const guid = nameParts[1].replace(')', '');

                              draft.ruleGuid = guid;
                              draft.rules = [{ value: guid, name: nameParts[0] }];

                              form.params = await debuggerEntitiesService
                                  .getParameters(newEntityType, entityLevel, entity?.guid ?? '', guid)
                                  .catch(() => new DebuggerParameters());
                              editForm(() => {}, true);
                          }
                      })
                    : form;
            }
            if (d instanceof InterpreterSession) {
                newDebug.current = false;
                return extractFormFromSession(d);
            }
            return form;
        },
    );

    const [sessionForm, setSessionForm] = useState(data.defaultContextForm);
    const { entityType, entityLevel, entity, ruleGuid, params: sections } = sessionForm;
    const { section, hasSections } = sections;
    const [overrideCanSubmit, setOverrideCanSubmit] = useState(true);

    const { entityLevels } = formLayout[entityType || '-'];
    const entityLevelSelected = entityLevels.length > 0 && entityLevel && entityLevel !== 'NONE' ? entity?.guid : true;
    const canSubmit =
        entityType &&
        entityLevelSelected &&
        (ruleGuid || entityType === 'POLICY_VALUE') &&
        (hasSections ? section : true) &&
        overrideCanSubmit;

    useEffect(() => {
        tab ? getSessionData().then(setSessionForm) : setSessionForm(data.defaultContextForm);
    }, [tabId, refreshSidebar, data.defaultContextForm]);

    const editForm = (recipe: (draft: Draft<DebuggerForm>) => void, dispose: boolean = false) => {
        const newForm = produce(sessionForm, recipe);
        if (!newDebug.current && interData) {
            if (dispose) dispatch({ type: MONACO_DISPOSE, payload: { layoutId, tabId: interData.generateTabId() } });
            dispatch({
                type: EDIT_TAB_DATA,
                payload: {
                    tabId: interData.generateTabId(),
                    data: produce(interData, (draft) => {
                        draft.form = newForm;
                    }),
                },
            });
        }
        setSessionForm(newForm);
    };

    const debugSessions = Object.values(tabs).filter((t) => t.data instanceof InterpreterSession);
    const debugFormId = 'DebugForm';
    return (
        <>
            <PanelTitle>Interpreter</PanelTitle>
            {debugSessions.length > 0 && (
                <CollapseContainer title="Open interpreters" defaultOpened>
                    <OpenInterpreterContainer>
                        <EntitySummaryList
                            rows={debugSessions}
                            rowMapper={(t: TabItem) => ({
                                id: t.data.generateTabId(),
                                entityType: t.data.getType(),
                                borderRadius: 0,
                                name: t.name,
                                tabType: t.tabType,
                                extraInformation: t.data.getExtra(),
                            })}
                            select={() => {}}
                        />
                    </OpenInterpreterContainer>
                </CollapseContainer>
            )}
            <CollapseContainer title="Default OIPA context">
                <DefaultContext />
            </CollapseContainer>
            <CollapseContainer title="Session Info" defaultOpened>
                <>
                    <Loading loading={loading} />
                    <DebugSessionInfo
                        formID={debugFormId}
                        editForm={editForm}
                        sessionForm={sessionForm}
                        canSubmit={!!canSubmit}
                        setOverrideCanSubmit={setOverrideCanSubmit}
                        load={load}
                        newDebug={newDebug}
                    />
                </>
            </CollapseContainer>
            {newDebug.current &&
                <NewDebugButton type="submit" buttonType="primary" disabled={!canSubmit || loading} form={debugFormId}>
                    Create Session
                </NewDebugButton>
            }
        </>
    );
};

DebuggerPanel.defaultProps = {
    debuggerEntitiesService: defaultDebuggerEntitiesService,
};

export default DebuggerPanel;
