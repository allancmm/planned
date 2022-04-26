import styled from "styled-components";

export const LabelStyle = styled.label<{ required?: boolean }>`
    color: ${({ theme }) => theme.colors.text.primary};
    display: block;
    font-size: 0.75rem;
    font-weight: var(--font-normal);
    letter-spacing: 0.02rem;
    line-height: 1.25rem;
    margin: 0;
    width: fit-content;
   :after {
       content: ${({ required }) => (required ? "\' *\'" : '')};
       color: ${(props) => props.theme.notifications['alert-2.1']};       
    }
`;