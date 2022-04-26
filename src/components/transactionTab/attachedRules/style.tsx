import {Search as SearchIcon} from 'react-feather';
import styled from 'styled-components';

export const PanelLabel = styled.label`
    font-size: 14px;
    font-weight: 400;
    margin: 0 0 0 7px;
`;

export const AttachedRulesContainer = styled.div`
    max-height: 300px;
    margin-bottom: 4px;
    & > div {
        max-height: 300px;
        overflow: auto;
    }
`;

export const StyledForm =  styled.form`
    padding: 0 7px;
`;

export const SearchLineWrapper = styled.div`
    display: flex;
`;

export const SearchFieldWrapper = styled.div`
    margin: 5px 0px 5px 10px;
    flex: 5 1 auto;
    position: relative;
`;

export const SearchFieldIcon = styled(SearchIcon)`
    position: absolute;
    color: ${({ theme }) => theme.colors.text.tertiary};

    height: 16px;
    width: 16px;

    top: 7px;
    left: 5px;
`;

export const SearchField = styled.div`
    input {
        border-radius: 4px 0px 0px 4px;
        padding-left: 22px;
    }
`;

export const SearchButton = styled.button`
    margin: 5px 10px 5px 0px;
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

export const SelectedList = styled.ul`
    list-style: none;
    padding-inline-start: 11px;
    margin-top: 3px;
    background-color: rgb(242,243,249);
    padding-bottom: 5px;
    
    & > li {
        font-size: smaller;
    }
`;

export const SelectedMark = styled.span`
    margin: 4px 2px -3px 0;
    height: 13px;
    width: 13px;
    background-color: #2196f3;
    display: inline-block;
    
    &:after {
        content: '';
        width: 6px;
        height: 10px;
        margin-left: 3px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        display: block;
    }
`;

export const LeftButtonWrapper = styled.div`
    float: left;
`;

export const RightButtonWrapper = styled.div`
    float: right;
`;