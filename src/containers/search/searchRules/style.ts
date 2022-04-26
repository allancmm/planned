import { MultiSelectDropdownWrapper } from 'equisoft-design-ui-elements';
import { Search as SearchIcon } from 'react-feather';
import styled from 'styled-components';
import { EntitySummaryList } from '../../../components/general/sidebar/entitySummary/entitySummaryList';

export const SearchBarMenu = styled.div`
    input {
        border-radius: 4px 0px 0px 4px;
        padding-left: 22px;
    }
`;

export const SearchButton = styled.button`
    margin: 5px 16px 5px 0px;
    border-radius: 0px 4px 4px 0px;
    color: ${(props) => props.theme.colors.text.primary};
    outline: none;
    background: ${({ theme }) => theme.colors.background.panel};
    border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    border-left: 0;
    height: 32px;
    flex: 1 0 auto;

    &:focus {
        border-color: ${({ theme }) => theme.colors.accent.main};
    }
`;

export const ClearSearchButton = styled.button`
    border-radius: 4px;

    color: ${(props) => props.theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.panel};
    border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    height: 25px;
`;

export const TableContainer = styled.div`
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 4px;
    
    .pagination-custom {
       margin-top: 16px;
    }
`;

export const SearchResponseList = styled(EntitySummaryList)`
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
`;

export const SearchInWrapper = styled.div`
    margin: 1px;
`;

export const AdvancedOptionsWrapper = styled.div`
    padding: 16px;
`;

export const FilterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    padding: var(--spacing-2x);
    & > div {
        width: 100%;
    }
`;

export const SearchResultsWrapper = styled.div`
    display: flex;
`;

export const SearchFieldIcon = styled(SearchIcon)`
    position: absolute;
    color: ${({ theme }) => theme.colors.text.tertiary};

    height: 16px;
    width: 16px;

    top: 7px;
    left: 5px;
`;

export const SearchFieldWrapper = styled.div`
    margin: 5px 0px 16px 16px;
    flex: 5 1 auto;
    position: relative;
`;

export const SearchTableSelectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0px 0px 0px;
`;

export const EntitySelectionWrapper = styled.div`
    margin-left: 1px;
    line-height: 20px;
    letter-spacing: 0.2px;
`;

export const SearchEntityDropdownWrapper = styled.div`
    height: 32px;

    ${MultiSelectDropdownWrapper} {
        letter-spacing: 0.4px;
    }
`;

export const AutoCompleteWrapper = styled.div`
    display: flex;
    color: ${({ theme }) => theme.colors.text.primary};
    position: relative;
`;

export const AutoCompleteContainer = styled.div`
    border-width: 0px 1px 1px 1px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.borders.secondary};
    background-color: ${({ theme }) => theme.colors.background.panel};
    right: 10px;
    position: absolute;
    left: 0;
    top: 32px;
    z-index: 10;
`;

export const AutoCompleteOption = styled.option`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
`;

export const ResultsContainer = styled.div`
   padding: var(--spacing-2x);   
   > div {
      max-height: unset;
   }
`;
