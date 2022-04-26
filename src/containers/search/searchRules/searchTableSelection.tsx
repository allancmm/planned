import { MultiSelectDropdown, SelectedField } from 'equisoft-design-ui-elements';
import { Draft } from 'immer';
import React from 'react';
import SearchRulesDocument, { AdvancedOptionsCheckBox } from '../../../lib/domain/entities/sidebarData/searchData';
import { SearchTableEnum } from '../../../lib/domain/enums/searchTable';
import { ValidSearchTable } from '../../../lib/domain/enums/validSearchTableEnum';
import { EntitySelectionWrapper, SearchEntityDropdownWrapper, SearchTableSelectionWrapper } from './style';

interface SearchTableSelectionProps {
    advancedOptions: AdvancedOptionsCheckBox;
    editSidebar(recipe: (d: Draft<SearchRulesDocument>) => void): void;
}

const SearchTableSelection = ({ editSidebar, advancedOptions }: SearchTableSelectionProps) => {
    const setSelectedFields = (selectedFields: SelectedField[]): void => {
        editSidebar((draft) => {
            draft.advancedOptions.selectedSearchTables = selectedFields;
        });
    };

    const getSelectedFieldFromName = (name: string): SelectedField => {
        const validSearchTable: ValidSearchTable = SearchTableEnum.getEnumFromName(name);
        const selectedField: SelectedField = {
            name: validSearchTable.name,
            displayName: validSearchTable.displayName,
        };
        return selectedField;
    };

    const getSelectableFields = (): SelectedField[] => {
        const selectableFields: SelectedField[] = [];
        SearchTableEnum.validSearchTables.map((vst) => {
            const selectableField: SelectedField = {
                name: vst.name,
                displayName: vst.displayName,
            };
            selectableFields.push(selectableField);
        });
        return selectableFields;
    };

    return (
        <SearchTableSelectionWrapper>
            <EntitySelectionWrapper>Search entity type</EntitySelectionWrapper>
            <SearchEntityDropdownWrapper>
                <MultiSelectDropdown
                    selectedFields={advancedOptions.selectedSearchTables}
                    selectableFields={getSelectableFields()}
                    setSelectedFields={setSelectedFields}
                    getSelectedFieldFromName={getSelectedFieldFromName}
                    selectAll
                    defaultSelectMessage={'Select an option'}
                />
            </SearchEntityDropdownWrapper>
        </SearchTableSelectionWrapper>
    );
};

export default SearchTableSelection;
