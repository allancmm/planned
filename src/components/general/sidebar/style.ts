import { X } from 'react-feather';
import styled from 'styled-components';

export const Nav = styled.nav`
    background-color: ${({ theme }) => theme.colors.background.nav};
    color: rgb(96, 102, 110);
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    height: calc(100% + 32px);    
    width: 72px;
    z-index: 3;
`;

export const Icon = styled.span<{active?: boolean }>`
    min-width: 22px;    
    > svg {
        height: 20px;
        width: 20px;
        color: ${({active, theme }) => active ? theme.colors.content.active.nav  : ''}
    }
`;

export const MainMenu = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 1;

    & + ul {
        margin-top: auto;
    }

    hr {
        background-color: ${({ theme }) => theme.colors.background.separator };
        border: 0;
        height: 1px;
        margin: var(--spacing-1x) auto;
        width: 40px;
    }

    li {
      &:active {
         background-color: ${({ theme }) => theme.colors.background.active.nav };
         color: ${({ theme }) => theme.colors.content.active.nav };
      }
    }
`;

export const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const MenuItem = styled.li<{disabled?: boolean }>`
    position: relative;
    pointer-events: ${({disabled}) => (disabled ? 'none' : 'auto')};
    opacity: ${({disabled}) => disabled ? '0.3' : 'inherit' };
    min-height: 56px;   
    &::before {
        position: absolute;     
        display: block;
        height: 100%;    
        width: 100%;
        content: '';   
        background-color: ${({ theme }) => theme.colors.background.active.nav};
        transform-origin: 50% 50%;
        transition: all 0.25s;        
        z-index: -1;   
    }
          
    :not(.active) {
        &::before {
            background-color: ${({ theme }) => theme.colors.background.hover.nav};
            transform: scale(0);
        }
    }

    &:hover:not(.active) {
        &::before {
            background-color: ${({ theme }) => theme.colors.background.hover.nav};           
            transform: scale(1);
        }
    }
    
    &:hover {
      > span {
         color: ${({ theme }) => theme.colors.content.hover.nav};
      },

      &:active > span, > div {
        color: ${({ theme }) => theme.colors.content.hover.nav};
      }
    }
`;

export const MenuLink = styled.a`    
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-decoration: none;
    align-items: center;
    padding: var(--spacing-1x) var(--spacing-1x);
`;

export const LabelContent = styled.div<{active?: boolean }>`
    font-size: 0.6875rem;
    line-height: 1.0rem;
    text-align: center;
    color: ${({ active, theme }) => active ? theme.colors.content.active.nav : ''}
`

//*************************************************************************************************************

export const Panel = styled.div`
    background-color: ${(props) => props.theme.colors.background.panel};
    color: ${(props) => props.theme.colors.text.primary};
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    white-space: nowrap;
    height: 100%;
    z-index: 2;
`;

export const PanelContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const PanelTitle = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: var(--spacing-2x);
    line-height: var(--spacing-3x);
    padding: var(--spacing-1x) var(--spacing-2x);
    font-weight: 600;
`;

export const PanelBreak = styled.hr`
    background-color: ${({ theme }) => theme.colors.borders.secondary};
    border: none;
    height: 2px;    
    margin: var(--spacing-2x) 0;
`;

export const CloseIcon = styled(X)`
    margin: 5px;
    height: 16px;
    width: 16px;
    fill: red;
    color: red;
    cursor: pointer;
`;

export const HeaderPanelContent = styled.div`
    display: flex;
    align-self: flex-end;
`;

export const PanelContentSection = styled.div`
   padding: var(--spacing-2x);
   
   & button {
      margin-top: var(--spacing-2x);
   }
`;

export const PanelContainer = styled.div`
   padding: var(--spacing-2x);
`;

export const PanelTitleContent = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: var(--spacing-2x);
    line-height: var(--spacing-3x);
    font-weight: var(--font-semi-bold);
    margin-bottom: var(--spacing-2x);
`;

export const ButtonContent = styled.div`
  padding: 0 var(--spacing-2x) var(--spacing-2x) var(--spacing-2x);
  margin-top: var(--spacing-1x);
  button {
     margin-right: var(--spacing-1x);
  }
`;


export const LongJobContainer = styled.div`
   margin-top: var(--spacing-2x);
`;

export const PanelSectionContainer = styled.div`
   padding: var(--spacing-2x) var(--spacing-2x) 0 var(--spacing-2x);
`;