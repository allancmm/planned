import {AsyncSelect} from 'equisoft-design-ui-elements';
import React from 'react';
import { OptionsList, Response } from 'react-select-async-paginate';
import InputText, {Options} from '../../../components/general/inputText';
import { defaultDebuggerEntitiesService } from '../../../lib/context';
import DebuggerEntity from '../../../lib/domain/entities/debuggerEntity';
import DebuggerForm from '../../../lib/domain/entities/debuggerForm';
import { EntityLevels } from '../../../lib/domain/enums/entityLevel';
import Pageable from '../../../lib/domain/util/pageable';
import DebuggerEntitiesService from '../../../lib/services/debuggerEntitiesService';
import formLayout from './form';
import { EntityLevelContainer } from './style';

interface EntityContextSelectorProps {
    form: DebuggerForm;
    debuggerEntitiesService: DebuggerEntitiesService;
    allLevels?: boolean;

    handleSelectEntityLevel(e: Options): void;
    handleEntityChange(val: DebuggerEntity): void;
}

const EntityContextSelector = ({
    form,
    debuggerEntitiesService,
    handleSelectEntityLevel,
    handleEntityChange,
    allLevels
}: EntityContextSelectorProps) => {
    const { entityType, entityLevel, entity } = form;

    const entitiesOptions = async (
        inputValue: string,
        _: OptionsList,
        { page }: { page: Pageable },
    ): Promise<Response> => {
        const response = await debuggerEntitiesService.getEntitiesForLevel(entityLevel, page, inputValue);

        return {
            options: response.responses,
            hasMore: !response.page.isLast(),
            additional: {
                page: response.page.nextPage(),
            },
        };
    };

    return (
        <EntityLevelContainer>
            <InputText type="select"
                       label="Context Level:"
                       value={entityLevel}
                       options={
                           allLevels
                               ? EntityLevels.map((e) => ({label: e, value: e}))
                               : formLayout[entityType]?.entityLevels?.map((e) => ({label: e, value: e})) ?? []
                       }
                       placeholder="Select One"
                       onChange={handleSelectEntityLevel}
            />

            {entityLevel.length > 0 && (
                <div style={{ marginTop: 'unset'}}>
                    <AsyncSelect
                        label="Context Data List: "
                        value={entity}
                        getOptionLabel={(o: DebuggerEntity) => o.displayName}
                        getOptionValue={(o: DebuggerEntity) => o.guid}
                        loadOptions={entitiesOptions}
                        cacheUniqs={[entityLevel]}
                        additional={{
                            page: Pageable.withPageOfSize(10),
                        }}
                        onChange={handleEntityChange}
                        isSearchable={entityLevel === 'CLIENT' || entityLevel === 'POLICY' || entityLevel === 'APPLICATION'}
                    />
                </div>
            )}
        </EntityLevelContainer>
    );
};

EntityContextSelector.defaultProps = {
    debuggerEntitiesService: defaultDebuggerEntitiesService,
};

export default EntityContextSelector;
