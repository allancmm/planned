import styled from 'styled-components';

export const TreeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 75vh;
    & > div {
        width: 100%;
    }
     
    .rstcustom__collapseButton,
    .rstcustom__expandButton {
        display: none !important;
    }
    .rstcustom__toolbarButton {
        display: flex;
    }
    
    .rstcustom__rowContents {
        left: calc(-1 * var(--spacing-1x));
    }
`;

export const LoadingContainer = styled.div`
    & > div {
        height: 4px;
    }
`;

export const NoResultContainer = styled.div`
   margin-top: var(--spacing-1x);
`;