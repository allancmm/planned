import styled from 'styled-components';

export const InfoContainer = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};

    & > div {
        border: 1px solid ${({ theme }) => theme.colors.borders.primary};
    }

    h3 {
        margin-top: 0;
    }
`;
