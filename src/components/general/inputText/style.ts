import styled from "styled-components";

export const InputContainer = styled.span<{ hasError: boolean, disabled?: boolean, isLightTheme: boolean }>`
    div {       
       border-color: ${({ theme, hasError }) => (hasError ? theme.notifications['alert-2.1'] : '')};
       color: ${({theme, disabled}) => (disabled ? theme.greys['mid-grey'] : '')};
       background-color: ${({ theme, disabled, isLightTheme }) => disabled && isLightTheme ? theme.greys['light-grey'] : theme.colors.background.main};
    } 
    button {
        background-color: ${({ theme, disabled, isLightTheme }) =>  disabled && isLightTheme ? theme.greys['light-grey'] : theme.colors.background.main} !important;
        color: ${({ theme, disabled }) => disabled ? 'unset' : theme.colors.text.primary} !important;
    }
    input {
        color: ${({ theme, disabled }) => disabled ? 'unset' : theme.colors.text.primary} !important;
        background-color: ${({ theme, disabled, isLightTheme }) => 
                 disabled && isLightTheme ? theme.greys['light-grey'] : theme.colors.background.panel} !important;
    }
`;

export const SelectSection = styled.div`
   ul {
       z-index: 10000
   }
`;

export const StepperSection = styled.div`
    > div {
         > div {
            max-width: 100%;
            input {
               width: 100%;
            }
         }
    }
`;
