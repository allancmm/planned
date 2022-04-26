import styled from 'styled-components';

export const ConfigPackageTabSidePanel = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow-y: auto;
    border: 1px solid ${({ theme }) => theme.greys['light-grey']};
`;

export const ConfigPackageContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 25vh;
    overflow-y: auto;
    padding: var(--spacing-2x); 
`;

export const ConfigPackageContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 25vh;
    padding: var(--spacing-2x);
`;

export const ConfigPackageDescription = styled.div`
   padding: var(--spacing-2x); 
`;

export const ButtonContent = styled.div<{isEdit?: boolean}>`
   > button {
        color: #57666e;
        font-size: 0.75rem;
   }
`;

export const ContentHeaderContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;

    > div {
        width: 45%;
    }
`;

export const ContentHalfWidthContainer = styled.div`
    & > div {
        width: 50%;
        float: left;
    }
`;
