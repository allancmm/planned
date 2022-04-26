import styled from "styled-components";

export const ListSection = styled.div<{ disabled?: boolean }>`
    display: flex;
    flex-direction: column;
    background: ${({ disabled }) => disabled ?  'rgb(242,243,249)' : 'inherit'};
    .selected {
        background: ${({ theme, disabled }) => disabled ?  theme.colors.background.hover.nav : theme.colors.background.active.nav};
        color: ${({ theme, disabled }) => disabled ? 'inherit' : theme.colors.text.secondary};
    }
    
`;

export const ListItem = styled.div<{active?: boolean, disabled?: boolean }>`
    display: flex;
    justify-content: start;
    align-items: center;
    height: 32px;
    max-width: 100%;
    cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
    span {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
    }

    &:hover {
        background: ${({ theme, active, disabled }) => {
             if(disabled && active){
                 return theme.colors.background.hover.nav;
             }
             if(disabled && !active){
                 return;
             }
             return active ? theme.colors.background.active.nav : theme.colors.background.hover.nav
        }};
        color: ${({ theme, active, disabled }) => {
            if(disabled) {
                return 'inherit';
            }
            return active ? theme.colors.text.secondary : theme.colors.content.hover.nav
        }};
        transform-origin: 50% 50%;
        transition: all 0.25s;     
    }
`;