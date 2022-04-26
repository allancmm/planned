import styled from 'styled-components';

export const LogJobContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;

    textarea {
        min-height: 60vh;
        resize: vertical;
        background-color: ${({ theme }) => theme.colors.background.main};
        color: ${(props) => props.theme.colors.text.primary};
    }

    p {
        color: ${({ theme }) => theme.colors.text.primary};
    }

`;
