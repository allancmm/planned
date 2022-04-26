import { DateInput, LoadMethod, Select } from 'equisoft-design-ui-elements';
import { Draft } from 'immer';
import React, { ChangeEvent, FormEvent, useContext } from 'react';
import { toast } from 'react-toastify';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { Options } from '../../../components/general/inputText';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultDebuggerEntitiesService, defaultEntityInformationService } from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import DebuggerEntity from '../../../lib/domain/entities/debuggerEntity';
import DebuggerForm from '../../../lib/domain/entities/debuggerForm';
import DebuggerParameters from '../../../lib/domain/entities/debuggerParameters';
import DebuggerDataDocument from '../../../lib/domain/entities/sidebarData/debuggerData';
import { EntityLevel } from '../../../lib/domain/enums/entityLevel';
import { EntityType } from '../../../lib/domain/enums/entityType';
import DebuggerEntitiesService from '../../../lib/services/debuggerEntitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import EntityContextSelector from './entityContextSelector';
import formLayout from './form';
import { DebugFormContainer } from './style';

interface DebugSessionInfoProps {
    formID: string;
    sessionForm: DebuggerForm;
    canSubmit: boolean;
    newDebug: React.MutableRefObject<boolean>;

    debuggerEntitiesService: DebuggerEntitiesService;
    entityInformationService: EntityInformationService;

    load: LoadMethod;
    setOverrideCanSubmit(b: boolean): void;
    editForm(recipe: (draft: Draft<DebuggerForm>) => void, dispose?: boolean): void;
}

const DebugSessionInfo = ({
    formID,
    editForm,
    sessionForm,
    debuggerEntitiesService,
    entityInformationService,
    canSubmit,
    newDebug,
    load,
    setOverrideCanSubmit,
}: DebugSessionInfoProps) => {
    const dispatch = useTabActions();
    const { entityType, entityLevel, entity, ruleGuid, rules, params: sections, effectiveDate } = sessionForm;
    const { ruleSections, section, hasSections } = sections;
    const { entityLevels } = formLayout[entityType || '-'];
    const { data } = useContext(SidebarContext);

    if (!(data instanceof DebuggerDataDocument)) {
        return null;
    }

    const reset = (draft: Draft<DebuggerForm>) => {
        draft.entityLevel = 'NONE';
        draft.entity = null;

        draft.ruleGuid = '';

        draft.rules = [];
        draft.params.section = '';
        draft.params.ruleSections = [];
        draft.params.hasSections = false;
    };

    const handleSelectEntityType = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();

        const newEntityType = e.target.value as EntityType;
        const newRules = await debuggerEntitiesService
            .getRules(newEntityType, entityLevel === '' ? 'NONE' : entityLevel, entity?.guid ?? '')
            .catch(() => []);

        newDebug.current = true;
        editForm((draft) => {
            reset(draft);
            if (formLayout[newEntityType]?.entityLevels.includes(data.defaultContextForm.entityLevel)) {
                draft.entityLevel = data.defaultContextForm.entityLevel;
                draft.entity = data.defaultContextForm.entity;
            } else {
                toast.warning('Cannot use the entity level from the default context');
            }
            draft.entityType = newEntityType;
            draft.rules = newRules;
        });
    });

    const handleSelectEntityLevel = load(async (e: Options) => {
        const newLevel = e.value as EntityLevel;
        let newRules: BasicEntity[] = rules;
        if (newLevel === 'NONE') {
            newRules = await debuggerEntitiesService.getRules(entityType, 'NONE', '').catch(() => []);
        }

        const breaksSession = !newDebug.current && !newRules.find((r) => r.value === ruleGuid);
        if (breaksSession) {
            newDebug.current = true;
            toast.warning('Rule not found in new context, session is now detached');
        }
        editForm((draft) => {
            draft.entityLevel = newLevel;
            draft.rules = newRules;
            draft.entity = null;
            if (breaksSession) draft.ruleGuid = '';
        });
    });

    const handleEntityChange = load(async (val: DebuggerEntity) => {
        const newRules = await debuggerEntitiesService.getRules(entityType, entityLevel, val.guid).catch(() => []);

        const newParametersData = ruleGuid
            ? await debuggerEntitiesService
                  .getParameters(entityType, entityLevel, val.guid, ruleGuid)
                  .catch(() => new DebuggerParameters())
            : new DebuggerParameters();

        const breaksSession = !newDebug.current && !newRules.find((r) => r.value === ruleGuid);
        if (breaksSession) {
            newDebug.current = true;
            toast.warning('Rule not found in new context, session is now detached');
        }
        editForm((draft) => {
            newParametersData.section = draft.params.section;

            draft.entity = val;
            draft.rules = newRules;
            draft.params = newParametersData;
            if (breaksSession) draft.ruleGuid = '';
        }, true);
    });

    const handleRuleChange = load(async (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        e.preventDefault();

        const newRule = e.target.value;
        const newParametersData = await debuggerEntitiesService
            .getParameters(entityType, entityLevel, entity?.guid ?? '', newRule)
            .catch(() => new DebuggerParameters());

        const relatedRule = await debuggerEntitiesService.getInterpreterEditorInformation(newRule, entityType);
        setOverrideCanSubmit(!!relatedRule.guid);

        newDebug.current = true;
        editForm((draft) => {
            draft.ruleGuid = newRule;
            draft.params = newParametersData;
        }, true);
    });

    const handleSectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const newSection = e.target.value;
        editForm((draft) => {
            draft.params.section = newSection;
        });
    };

    const handleSubmitForm = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) toast('incomplete form');
        const editorInformation = await debuggerEntitiesService.getInterpreterEditorInformation(
            entityType === 'POLICY_VALUE' && sessionForm.entity != null ? sessionForm.entity.guid : ruleGuid,
            entityType,
        );
        const entityInformation = await entityInformationService.getEntityInformation(
            editorInformation.entityType,
            editorInformation.guid,
            'XML_DATA',
        );

        const d = entityInformation.createInterpreterData(ruleGuid, entityType);
        d.form = sessionForm;
        dispatch({ type: OPEN, payload: { data: d, hidden: true } });

        entityInformation.interpreterOpened = true;
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        newDebug.current = false;
    });

    return (
        <DebugFormContainer id={formID} onSubmit={handleSubmitForm}>
            <Select
                label="Entity type:"
                options={Object.values(formLayout).map((f) => ({
                    label: f.label,
                    value: f.value,
                }))}
                value={entityType}
                onChange={handleSelectEntityType}
            />

            {entityLevels.length > 0 && (
                <EntityContextSelector
                    form={sessionForm}
                    handleEntityChange={handleEntityChange}
                    handleSelectEntityLevel={handleSelectEntityLevel}
                />
            )}

            {entityType && (
                <>
                    {entityType !== 'POLICY_VALUE' ? (
                        <Select
                            label={entityType === 'ACTIVITY' ? 'Activity List:' : 'Rule:'}
                            emptySelectText="Select One"
                            options={rules.map((r) => ({
                                label: r.name,
                                value: r.value,
                            }))}
                            value={ruleGuid}
                            onChange={handleRuleChange}
                        />
                    ) : (
                        <DateInput
                            label="Effective Date:"
                            selected={effectiveDate}
                            onChange={(d) =>
                                editForm((draft) => {
                                    draft.effectiveDate = d as Date;
                                })
                            }
                        />
                    )}
                    {hasSections &&
                        (ruleSections.length > 0 ? (
                            <Select
                                label="Section:"
                                emptySelectText="Select One"
                                options={ruleSections.map((r) => ({
                                    label: r,
                                }))}
                                value={section}
                                onChange={handleSectionChange}
                            />
                        ) : (
                            <div>Missing sections</div>
                        ))}
                </>
            )}
        </DebugFormContainer>
    );
};

DebugSessionInfo.defaultProps = {
    entityInformationService: defaultEntityInformationService,
    debuggerEntitiesService: defaultDebuggerEntitiesService,
};

export default DebugSessionInfo;
