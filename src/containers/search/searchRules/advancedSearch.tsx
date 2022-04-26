import React, { ChangeEvent, useEffect, useState } from 'react';
import { CollapseContainer } from 'equisoft-design-ui-elements';
import { Draft } from 'immer';
import SearchRulesDocument, { AdvancedOptionsCheckBox } from '../../../lib/domain/entities/sidebarData/searchData';
import SearchTableSelection from './searchTableSelection';
import { AdvancedOptionsWrapper,  SearchInWrapper } from './style';
import InputText from "../../../components/general/inputText";

const OPTIONS_SEARCH = [{ label: 'Name', value: 'name' }, { label: 'XML data', value: 'xml' }];

interface AdvancedSearchProps {
    advancedOptions: AdvancedOptionsCheckBox;
    editSidebar(recipe: (d: Draft<SearchRulesDocument>) => void): void;
}

const AdvancedSearch = ({ editSidebar, advancedOptions }: AdvancedSearchProps) => {
    const [radio, setRadio] = useState('name');

    useEffect(() => {
        editSidebar((draft) => {
            draft.advancedOptions.isRuleNameSearchTermChecked = true;
        });
        setRadio(advancedOptions.isRuleNameSearchTermChecked ? 'name' : 'xml');
    }, []);

    const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>): void => {
        editSidebar((draft) => {
            switch (event.target.value) {
                case 'name':
                    setRadio('name');
                    draft.advancedOptions.isXmlSearchTermChecked = false;
                    draft.advancedOptions.isRuleNameSearchTermChecked = true;
                    break;
                case 'xml':
                    setRadio('xml');
                    draft.advancedOptions.isXmlSearchTermChecked = true;
                    draft.advancedOptions.isRuleNameSearchTermChecked = false;
                    break;
            }
        });
    };

    return (
        <CollapseContainer title='Advanced Options'>
            <AdvancedOptionsWrapper>
                <SearchInWrapper>
                    <InputText
                        type='radio'
                        groupName='advOption'
                        label='Search in:'
                        options={OPTIONS_SEARCH}
                        onChange={handleSearchTermChange}
                        checkedValue={radio}
                    />
                </SearchInWrapper>

                <SearchTableSelection editSidebar={editSidebar} advancedOptions={advancedOptions} />
            </AdvancedOptionsWrapper>
        </CollapseContainer>
    );
};

export default AdvancedSearch;
