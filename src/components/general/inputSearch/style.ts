import styled from "styled-components";

export const InputSearchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    button {
        width: 28px;
        height: 32px;
        border-radius: 0px 4px 4px 0px;
        color: ${(props) => props.theme.colors.text.primary};
        outline: none;
        background: ${({ theme }) => theme.colors.background.panel};
        border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
        border-left: 0;
        flex: 0 0 auto;
        margin: 0;
        padding: 0;
        cursor: unset;

        &:focus {
            border-color: ${({ theme }) => theme.colors.accent.main};
        }
    }
`;
