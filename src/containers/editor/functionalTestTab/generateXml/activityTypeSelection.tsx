import { AsyncSelect, LoadMethod, Select } from 'equisoft-design-ui-elements';
import React, { ChangeEvent, useState } from 'react';
import { OptionsList, Response } from 'react-select-async-paginate';
import { defaultDebuggerEntitiesService } from '../../../../lib/context';
import BasicEntity from '../../../../lib/domain/entities/basicEntity';
import DebuggerEntity from '../../../../lib/domain/entities/debuggerEntity';
import { EntityLevel } from '../../../../lib/domain/enums/entityLevel';
import Pageable from '../../../../lib/domain/util/pageable';
import DebuggerEntitiesService from '../../../../lib/services/debuggerEntitiesService';
import formLayout from '../../debugger/form';
import { SelectionWrapper } from './style';
interface ActivityTypeSelectionProps {
    radioSelection: string;
    entity: DebuggerEntity | null;
    ruleGuid: string;

    debuggerEntitiesService: DebuggerEntitiesService;
    load: LoadMethod;
    setEntity(e: DebuggerEntity | null): void;
    setRuleGuid(guid: string): void;
}

const ActivityTypeSelection = ({
    debuggerEntitiesService,
    radioSelection,
    entity,
    ruleGuid,
    load,
    setEntity,
    setRuleGuid,
}: ActivityTypeSelectionProps) => {
    const [internalLevel, setInternalLevel] = useState<EntityLevel>('NONE');
    const [rules, setRules] = useState<BasicEntity[]>([]);

    const handleSelectEntityLevel = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();

        const newLevel = e.target.value as EntityLevel;
        setInternalLevel(newLevel);
        setEntity(null);
        setRuleGuid('');
    });

    const handleEntityChange = load(async (val: DebuggerEntity) => {
        const newGuid = val.guid;
        setEntity(val);

        if (radioSelection === 'fromData') {
            const newRules = await debuggerEntitiesService.getRules('ACTIVITY', internalLevel, newGuid).catch(() => []);
            setRules(newRules);
        } else if (radioSelection === 'template') {
            const newRules = await debuggerEntitiesService
                .getRules('TRANSACTIONS', internalLevel, newGuid)
                .catch(() => []);
            setRules(newRules);
        }
        setRuleGuid('');
    });

    const entitiesOptions = async (
        inputValue: string,
        _: OptionsList,
        { page }: { page: Pageable },
    ): Promise<Response> => {
        const response = await debuggerEntitiesService.getEntitiesForLevel(internalLevel, page, inputValue);

        return {
            options: response.responses,
            hasMore: !response.page.isLast(),
            additional: {
                page: response.page.nextPage(),
            },
        };
    };

    const activity: EntityLevel = 'ACTIVITY';
    return (
        <>
            <SelectionWrapper>
                <Select
                    label="Entity Level:"
                    emptySelectText="Select One"
                    options={formLayout[activity].entityLevels.map((e) => ({
                        label: e,
                    }))}
                    required
                    value={internalLevel}
                    onChange={handleSelectEntityLevel}
                />
            </SelectionWrapper>

            {internalLevel !== 'NONE' && (
                <SelectionWrapper>
                    <AsyncSelect
                        label="Entity List: "
                        value={entity}
                        getOptionLabel={(o: DebuggerEntity) => o.displayName}
                        getOptionValue={(o: DebuggerEntity) => o.guid}
                        loadOptions={entitiesOptions}
                        cacheUniqs={[internalLevel]}
                        additional={{
                            page: Pageable.withPageOfSize(10),
                        }}
                        onChange={handleEntityChange}
                        isSearchable={
                            internalLevel === 'CLIENT' || internalLevel === 'POLICY' || internalLevel === 'APPLICATION'
                        }
                    />
                </SelectionWrapper>
            )}

            {radioSelection === 'fromData' && entity?.guid && (
                <SelectionWrapper>
                    <Select
                        label="Activity: "
                        emptySelectText="Select One"
                        options={rules.map((r) => ({
                            label: r.name,
                            value: r.value,
                        }))}
                        value={ruleGuid}
                        onChange={(e) => {
                            setRuleGuid(e.target.value);
                        }}
                    />
                </SelectionWrapper>
            )}

            {radioSelection === 'template' && entity?.guid && (
                <SelectionWrapper>
                    <Select
                        label="Transaction: "
                        emptySelectText="Select One"
                        options={rules.map((r) => ({
                            label: r.name,
                            value: r.value,
                        }))}
                        value={ruleGuid}
                        onChange={(e) => {
                            setRuleGuid(e.target.value);
                        }}
                    />
                </SelectionWrapper>
            )}
        </>
    );
};

ActivityTypeSelection.defaultProps = {
    debuggerEntitiesService: defaultDebuggerEntitiesService,
};

export default ActivityTypeSelection;
