import { AsyncSelect, LoadMethod, Select } from 'equisoft-design-ui-elements';
import React, { useEffect, useState } from 'react';
import { OptionsList, Response } from 'react-select-async-paginate';
import { defaultDebuggerEntitiesService, defaultGenerateXmlService } from '../../../../lib/context';
import BasicEntity from '../../../../lib/domain/entities/basicEntity';
import DebuggerEntity from '../../../../lib/domain/entities/debuggerEntity';
import { EntityLevel } from '../../../../lib/domain/enums/entityLevel';
import Pageable from '../../../../lib/domain/util/pageable';
import DebuggerEntitiesService from '../../../../lib/services/debuggerEntitiesService';
import GenerateXmlService from '../../../../lib/services/generateXmlService';
import { CodeWrapper, SelectionWrapper } from './style';

interface GenerateXmlProps {
    radioSelection: string;
    entityLevel: EntityLevel;
    entity: DebuggerEntity | null;
    systemCode: string;
    stateCode: string;

    debuggerEntitiesService: DebuggerEntitiesService;
    generateXmlService: GenerateXmlService;
    load: LoadMethod;
    setEntity(e: DebuggerEntity | null): void;
    setStateCode(code: string): void;
    setSystemCode(code: string): void;
}

const PolicyApplicationTypeSelection = ({
    debuggerEntitiesService,
    generateXmlService,
    radioSelection,
    entityLevel,
    entity,
    systemCode,
    stateCode,
    load,
    setEntity,
    setStateCode,
    setSystemCode,
}: GenerateXmlProps) => {
    const [internalLevel, setInternalLevel] = useState<EntityLevel>(entityLevel);
    const [applicationPlan, setApplicationPlan] = useState(false);
    const [systemCodes, setSystemCodes] = useState<BasicEntity[]>([]);
    const [stateCodes, setStateCodes] = useState<BasicEntity[]>([]);

    useEffect(() => {
        setInternalLevel(entityLevel);
        if (radioSelection === 'fromData') {
            setApplicationPlan(false);
        } else if (radioSelection === 'template') {
            setInternalLevel('PLAN');
            setApplicationPlan(true);
            setCodes();
        }
        setEntity(null);
    }, [entityLevel, radioSelection]);

    const setCodes = load(async () => {
        const states = await generateXmlService.getCodes('STATE');
        setStateCodes(states);
        setStateCode('');
        const system = await generateXmlService.getCodes('SYSTEM');
        setSystemCodes(system);
        setSystemCode('');
    });

    const entitiesOptions = async (
        inputValue: string,
        _: OptionsList,
        { page }: { page: Pageable },
    ): Promise<Response> => {
        const response = await debuggerEntitiesService.getEntitiesForLevel(
            internalLevel,
            page,
            inputValue,
            applicationPlan,
        );

        return {
            options: response.responses,
            hasMore: !response.page.isLast(),
            additional: {
                page: response.page.nextPage(),
            },
        };
    };

    return (
        <>
            {radioSelection === 'fromData' && (
                <SelectionWrapper>
                    <AsyncSelect
                        label="Policy: "
                        value={entity}
                        getOptionLabel={(o: DebuggerEntity) => o.displayName}
                        getOptionValue={(o: DebuggerEntity) => o.guid}
                        loadOptions={entitiesOptions}
                        cacheUniqs={[internalLevel, applicationPlan]}
                        additional={{
                            page: Pageable.withPageOfSize(10),
                        }}
                        onChange={setEntity}
                        isSearchable
                    />
                </SelectionWrapper>
            )}
            {radioSelection === 'template' && (
                <>
                    <SelectionWrapper>
                        <AsyncSelect
                            label="Plan Name: "
                            value={entity}
                            getOptionLabel={(o: DebuggerEntity) => o.displayName}
                            getOptionValue={(o: DebuggerEntity) => o.guid}
                            loadOptions={entitiesOptions}
                            cacheUniqs={[internalLevel, applicationPlan]}
                            additional={{
                                page: Pageable.withPageOfSize(10),
                            }}
                            onChange={setEntity}
                            isSearchable
                        />
                    </SelectionWrapper>
                    <SelectionWrapper>
                        <CodeWrapper>
                            <Select
                                label="System Code: "
                                emptySelectText="None"
                                options={systemCodes.map((e) => ({
                                    label: e.name,
                                    value: e.value,
                                }))}
                                value={systemCode}
                                onChange={(e) => setSystemCode(e.target.value)}
                            />

                            <Select
                                label="State Code: "
                                emptySelectText="None"
                                options={stateCodes.map((e) => ({
                                    label: e.name,
                                    value: e.value,
                                }))}
                                value={stateCode}
                                onChange={(e) => setStateCode(e.target.value)}
                            />
                        </CodeWrapper>
                    </SelectionWrapper>
                </>
            )}
        </>
    );
};

PolicyApplicationTypeSelection.defaultProps = {
    debuggerEntitiesService: defaultDebuggerEntitiesService,
    generateXmlService: defaultGenerateXmlService,
};

export default PolicyApplicationTypeSelection;
