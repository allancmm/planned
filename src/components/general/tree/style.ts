import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RefreshCw } from 'react-feather';
import styled, { css } from 'styled-components';

export const TreeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    height: 75vh;

    & > div {
        width: 100%;
    }
    
    .ReactVirtualized__Grid__innerScrollContainer {
        left: -10px;
    }
    
    .gwAAJr {
        vertical-align: unset;
        margin-top: 2px;
    } 
`;

export const TreeIconStyle = css`
    margin-right: 4px;
    font-size: 16px;
`;

export const TreeFileIcon = styled(FontAwesomeIcon)`
    ${TreeIconStyle}
    vertical-align: 0;
`;

export const Separator = styled.hr`
    height: 0px;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    width: 220px;
`;

export const RefreshTreeIcon = styled(RefreshCw)`
    width: 15px;
    height: 15px;
`;

