import {inputsStyle} from 'equisoft-design-ui-elements';
import styled from 'styled-components';

export const CellText = styled.div`
    height: 100%;
    display: table;
    
    > span {
        vertical-align: middle;
        display: table-cell;
    }
`;

export const DateInput = styled.input`
    ${inputsStyle}    
    background: ${({ theme }) => theme.colors.background.panel};
`;