import { CollapseContainer, Loading, useLoading } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { MouseEvent, useContext, useLayoutEffect, useRef } from 'react';
import { Key } from 'ts-key-enum';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import GroupedEntitySummaryList from '../../../components/general/sidebar/entitySummary/groupedEntitySummaryList';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { PanelTitle } from '../../../components/general/sidebar/style';
import { defaultEntityInformationService, defaultSearchRulesService } from '../../../lib/context';
import { SearchResponse } from '../../../lib/domain/entities/searchResponse';
import SearchRulesDocument from '../../../lib/domain/entities/sidebarData/searchData';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import { ValidSearchTable } from '../../../lib/domain/enums/validSearchTableEnum';
import EntityInformationService from '../../../lib/services/entityInformationService';
import SearchRulesService from '../../../lib/services/searchRulesService';
import { isGuid } from '../../../lib/util/stringUtil';
import AdvancedSearch from './advancedSearch';
import AutocompleteTextField from './autoCompleteTextField';
import FilterOptions from './filterOptions';
import { rulesName } from './rulesNames';
import { CloseIcon } from "../../../components/general";
import {
    ResultsContainer,
    FilterWrapper,
    SearchBarMenu,
    SearchButton,
    SearchFieldIcon,
    SearchFieldWrapper,
    SearchResultsWrapper,
} from './style';

interface SearchRulesProps {
    searchRulesService: SearchRulesService;
    entityInformationService: EntityInformationService;
}

const SearchRules = ({ searchRulesService, entityInformationService }: SearchRulesProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const { sidebarSize, data, editSidebarData } = useContext(SidebarContext);

    if (!(data instanceof SearchRulesDocument)) {
        return null;
    }

    const { searchTerm, hasSearched, searchResponse, advancedOptions, filter } = data;
    const { companyGuid, planGuid, productGuid } = filter;

    const [loading, load] = useLoading();
    const dispatch = useTabActions();

    const fetchSearchedRules = load(async () => {
        let sr: SearchResponse[];
        const validSearchTables: ValidSearchTable[] = [];
        advancedOptions.selectedSearchTables.map((st) => {
            const vst: ValidSearchTable = {
                name: st.name,
                displayName: st.displayName,
            };
            validSearchTables.push(vst);
        });

        if (isSearchQuery() || isGuid(searchTerm)) {
            sr = await searchRulesService.getSearchResponsesBySearchTerm(
                searchTerm.trim(),
                validSearchTables,
                companyGuid,
                productGuid,
                planGuid,
            );
        } else {
            sr = await searchRulesService.getSearchResponsesByFields(
                advancedOptions.isRuleNameSearchTermChecked ? searchTerm.trim() : '',
                advancedOptions.isXmlSearchTermChecked ? searchTerm.trim() : '',
                validSearchTables,
                companyGuid,
                productGuid,
                planGuid,
            );
        }

        editSidebarData<SearchRulesDocument>((draft) => {
            draft.searchResponse = sr;
            draft.hasSearched = true;
        });
    });

    const isSearchQuery = (): boolean => {
        return searchTerm.toLowerCase().includes(' in ');
    };

    const openSearchResult = load(async (entityToOpen: SearchResponse) => {
        const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
            entityToOpen.entityType,
            entityToOpen.entityGuid,
            entityToOpen.fileType,
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
    });

    const clearSearchedRules = async (e: MouseEvent<SVGElement>) => {
        e.stopPropagation();
        e.preventDefault();

        editSidebarData<SearchRulesDocument>((draft) => {
            draft.searchResponse = [];
            draft.hasSearched = false;
        });
    };

    useLayoutEffect(() => {
        if (hasSearched && searchResponse.length > 0) {
            resultRef.current?.focus();
        } else if (sidebarSize > 0) {
            inputRef?.current?.focus();
        }
    }, [sidebarSize, hasSearched, searchResponse]);

    return (
        <>
            <Loading loading={loading} />
            <PanelTitle>Search</PanelTitle>
            <SearchResultsWrapper>
                <SearchFieldWrapper>
                    <SearchFieldIcon />
                    <SearchBarMenu>
                        <AutocompleteTextField
                            elements={rulesName}
                            handleChange={(value) => {
                                editSidebarData<SearchRulesDocument>((draft) => {
                                    draft.searchTerm = value;
                                });
                            }}
                            handleKeyboard={(e) => {
                                if (e.key === Key.Enter) fetchSearchedRules();
                            }}
                            handleOnclick={(value) => {
                                editSidebarData<SearchRulesDocument>((draft) => {
                                    draft.searchTerm = value;
                                });
                            }}
                            refElement={inputRef}
                        />
                    </SearchBarMenu>
                </SearchFieldWrapper>

                <SearchButton onClick={fetchSearchedRules}>Search</SearchButton>
            </SearchResultsWrapper>

            <CollapseContainer title='Filters'>
                <FilterWrapper>
                    <FilterOptions
                        data={filter}
                        editFilter={(recipe) =>
                            editSidebarData<SearchRulesDocument>((draft) => {
                                draft.filter = produce(filter, recipe);
                            })
                        }
                        load={load}
                    />
                </FilterWrapper>
            </CollapseContainer>

            <AdvancedSearch editSidebar={editSidebarData} advancedOptions={advancedOptions} />

            <CollapseContainer
                title={'Results'}
                defaultOpened
                actions={
                    hasSearched ?
                        <CloseIcon onClick={clearSearchedRules} /> : <></>
                }
            >
                <ResultsContainer>
                    <GroupedEntitySummaryList
                        ref={resultRef}
                        rows={searchResponse}
                        select={openSearchResult}
                        defaultCursor={0}
                        rowMapper={(sr: SearchResponse) => ({
                            id: `${sr.entityGuid}-${sr.fileType}`,
                            entityType: sr.entityType,
                            name: sr.entityName,
                            extraInformation: sr.ruleOverride.overrideName,
                            onClick: () => openSearchResult(sr),
                        })}
                    />
                </ResultsContainer>
            </CollapseContainer>
        </>
    );
};

SearchRules.defaultProps = {
    searchRulesService: defaultSearchRulesService,
    entityInformationService: defaultEntityInformationService,
};

export default SearchRules;
