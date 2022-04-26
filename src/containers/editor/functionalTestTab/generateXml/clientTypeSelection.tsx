import { AsyncSelect, LoadMethod, Select } from 'equisoft-design-ui-elements';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { OptionsList, Response } from 'react-select-async-paginate';
import { defaultDebuggerEntitiesService, defaultGenerateXmlService } from '../../../../lib/context';
import BasicEntity from '../../../../lib/domain/entities/basicEntity';
import DebuggerEntity from '../../../../lib/domain/entities/debuggerEntity';
import Pageable from '../../../../lib/domain/util/pageable';
import DebuggerEntitiesService from '../../../../lib/services/debuggerEntitiesService';
import GenerateXmlService from '../../../../lib/services/generateXmlService';
import { SelectionWrapper } from './style';

interface GenerateXmlProps {
    radioSelection: string;
    entity: DebuggerEntity | null;

    debuggerEntitiesService: DebuggerEntitiesService;
    generateXmlService: GenerateXmlService;
    load: LoadMethod;
    setEntity(e: DebuggerEntity | null): void;
}

const ClientTypeSelection = ({
    debuggerEntitiesService,
    generateXmlService,
    radioSelection,
    entity,
    load,
    setEntity,
}: GenerateXmlProps) => {
    const [clientTypeCodes, setClientTypeCodes] = useState<BasicEntity[]>([]);

    useEffect(() => {
        if (radioSelection === 'fromData') {
            setClients();
        } else if (radioSelection === 'template') {
            setCodes();
        }
    }, [radioSelection]);

    const setClients = load(async () => {
        setEntity(null);
    });

    const setCodes = load(async () => {
        const clients = await generateXmlService.getCodes('CLIENT');
        setClientTypeCodes(clients);
        setEntity(null);
    });

    const entitiesOptions = async (
        inputValue: string,
        _: OptionsList,
        { page }: { page: Pageable },
    ): Promise<Response> => {
        const response = await debuggerEntitiesService.getEntitiesForLevel('CLIENT', page, inputValue);

        return {
            options: response.responses,
            hasMore: !response.page.isLast(),
            additional: {
                page: response.page.nextPage(),
            },
        };
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        let de: DebuggerEntity | null = null;
        const ct = clientTypeCodes.find((c) => c.value === e.target.value);
        if (ct) {
            de = new DebuggerEntity();
            de.displayName = ct.name;
            de.guid = ct.value;
        }
        setEntity(de);
    };

    return (
        <>
            {radioSelection === 'fromData' && (
                <SelectionWrapper>
                    <AsyncSelect
                        label="Client: "
                        value={entity}
                        getOptionLabel={(o: DebuggerEntity) => o.displayName}
                        getOptionValue={(o: DebuggerEntity) => o.guid}
                        loadOptions={entitiesOptions}
                        additional={{
                            page: Pageable.withPageOfSize(10),
                        }}
                        onChange={setEntity}
                        isSearchable
                    />
                </SelectionWrapper>
            )}
            {radioSelection === 'template' && (
                <SelectionWrapper>
                    <Select
                        label="Client Type: "
                        emptySelectText="Select One"
                        options={clientTypeCodes.map((e) => ({
                            label: e.name,
                            value: e.value,
                        }))}
                        required
                        value={entity?.guid}
                        onChange={handleSelectChange}
                    />
                </SelectionWrapper>
            )}
        </>
    );
};

ClientTypeSelection.defaultProps = {
    debuggerEntitiesService: defaultDebuggerEntitiesService,
    generateXmlService: defaultGenerateXmlService,
};

export default ClientTypeSelection;
