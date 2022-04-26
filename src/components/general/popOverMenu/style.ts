import styled, {css} from "styled-components";

export const PopOverMenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    
    li:hover {
       background: ${({ theme}) => theme.colors.background.hover.nav };
    }   
    > div {
       z-index: 1000;
       min-width: 200px;   
    }
    
    .MuiPaper-rounded {
        border: 1px solid ${({ theme }) => theme.greys['dark-grey'] };
    }
    
    .MuiMenuItem-root {
       font-family: inherit;
       font-size: 0.875rem;
       color: #000000;
    }
    
    .start-icon {
       display: flex;
       margin-right: 7px;
       align-items: center;
    }
`;

export const IconMenuStyle = css`
    width: var(--spacing-2x);
    height: var(--spacing-2x);
`;