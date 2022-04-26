import { Search as SearchIcon } from 'react-feather';
import styled from 'styled-components';
import { EntitySummaryList } from '../../components/general/sidebar/entitySummary/entitySummaryList';

export const DataManagementFormContainer = styled.form`
    padding: 16px;
`;

export const SelectionWrapper = styled.div`
    margin: 16px 0 0;
`;

export const SearchFieldIcon = styled(SearchIcon)`
    position: absolute;
    color: ${({ theme }) => theme.colors.text.tertiary};

    height: 16px;
    width: 16px;

    top: 7px;
    left: 5px;
`;

export const SearchResultsWrapper = styled.div`
    display: flex;
`;

export const SearchFieldWrapper = styled.div`
    flex: 5 1 auto;
    position: relative;
`;

export const SearchBarMenu = styled.div`
    input {
        border-radius: 4px 0px 0px 4px;
        padding-left: 22px;
    }
`;

export const SearchButton = styled.button`
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

export const SearchResponseList = styled(EntitySummaryList)`
    max-height: 700px;
    overflow-y: auto;
    overflow-x: hidden;
`;

export const Icon = styled.span`
    display: inline-block;
    font-weight: var(--f-bold);
    margin-right: var(--s-base);
    width: var(--s-double);

    &:empty {
        margin: 0;
        width: 0;
    }

    > svg {
        height: 14px;
        width: 14px;
    }
`;
export const EntityLevelContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const FieldFormWrapper = styled.div`
   margin: 16px 0 0;
   
   > div + div {
     margin: 10px 0 0;
   }
`;

export const ButtonSection = styled.div`
  display: flex;
  flex-direction: column; 
  margin-top: 16px;
`;