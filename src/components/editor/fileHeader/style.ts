import { SelectInline } from 'equisoft-design-ui-elements';
import { MoreHorizontal } from 'react-feather';
import styled from 'styled-components';

export const FileHeaderContainer = styled.div`
    border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
    padding: var(--s-half) var(--s-base) var(--s-half);
`;

export const FileHeaderSection = styled.div`    
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    min-height: var(--spacing-4x);
    > div {
        display: flex;
    }
`;

export const FileHeaderDropdown = styled(SelectInline)`
    select {
        margin-right: 50px;
    }
`;

export const FileHeaderLabel = styled.div`
    font-weight: bold;
`;
export const FileHeaderLabelDropdown = styled.label`
    margin-top: 2px;
    font-weight: bold;
    margin-right: 10px;
    margin-left: 10px;
`;

export const FileHeaderValue = styled.div`
    padding-left: 4px;
    padding-right: 50px;
`;

export const Actions = styled.div`
    align-items: center;
    margin-left: auto;
`;

export const ActionButtons = styled.div`
    display: flex;

    & > button {
        margin: 0 2px;
    }
`;

export const MoreIcon = styled(MoreHorizontal)`
    height: 1rem;
    width: 1rem;
`;

export const ErrorBlockList = styled.ul`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 400px;
    overflow-y: auto !important
`;

export const ErrorBlock = styled.li`
    color: red;
    padding: 4px 8px;
    border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
`;


export const MenuContainer = styled.div`
   cursor: pointer;
`;

export const AddPackageContent = styled.div`
   margin-bottom: var(--spacing-3x);
`;

export const CreateSelectContent = styled.div`
   > div {
      height: 34px;
      > div {
        border: 1px solid ${({ theme }) => theme.greys['dark-grey']};
      }
   }
`;

export const FooterButtons = styled.div`
    display: flex;

    & > button {
        margin-right: var(--s-half);
    }
`;

export const MoreMenuContainer = styled.div`
   margin-left: var(--spacing-1x);
`;