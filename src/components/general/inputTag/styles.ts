import styled from "styled-components";

export const InputTagContainer = styled.div`
    input {
      background-color: ${({ theme }) => theme.colors.background.main} !important;
      color: ${(props) => props.theme.colors.text.primary} !important;  
    }
`