import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Button} from 'equisoft-design-ui-elements';
import {Check, X} from 'react-feather';
import styled, {css} from 'styled-components';

export const VariablesTable = styled.div`
    width: 100%;
    padding: 6px 12px 16px;
    
    & input {
       width: 100% !important;
    }
`;

export const ButtonContent = styled.div`
    float: right;
    
    > button {
        color: #fff;
        font-size: 0.75rem;
    }
`;

export const ActionIcon = styled(FontAwesomeIcon)`
   cursor: pointer;
`;

const icon = css`
    height: 12px;
    width: 12px;
    margin-right: 5px;
`;

export const CheckIcon = styled(Check)`
    ${icon};
    color: green !important;
`;

export const CancelIcon = styled(X)`
    ${icon};
`;

export const RightButton = styled(Button)`
    float: right;
    display: block !important;
`;

export const InputCell = styled.div`
    background-color: #fff;
    float: left;
    width: 100%;
    height: 100%;
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
