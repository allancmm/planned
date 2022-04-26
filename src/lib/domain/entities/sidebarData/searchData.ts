import { SelectedField } from 'equisoft-design-ui-elements';
import EntityFilter from '../entityFilter';
import { SearchResponse } from '../searchResponse';
import { ISidebarData } from './iSidebarData';

export interface AdvancedOptionsCheckBox {
    isRuleNameSearchTermChecked: boolean;
    isXmlSearchTermChecked: boolean;
    selectedSearchTables: SelectedField[];
}

export default class SearchRulesDocument extends ISidebarData {
    clazz: string = 'SearchRulesDocument';

    public searchTerm: string = '';

    public hasSearched: boolean = false;
    public searchResponse: SearchResponse[] = [];

    public filter: EntityFilter = new EntityFilter();

    public advancedOptions: AdvancedOptionsCheckBox = {
        isRuleNameSearchTermChecked: true,
        isXmlSearchTermChecked: false,
        selectedSearchTables: [],
    };
}