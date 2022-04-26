import styled from 'styled-components';

export const FooterContainer = styled.footer`
    align-items: center;
    display: flex;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.background.footer};
    color: ${({ theme }) => theme.colors.text.primary};
    grid-area: footer;
    padding-left: 56px;
    z-index: 2;
`;

export const FooterElement = styled.div`
    display: inline-block;
    margin: 0 16px;
`;

export const BoldFooter = styled(FooterElement)`
    font-weight: 600;
`;

export const ConnectionLostElement = styled(FooterElement)`
    font-weight: bold;
    color: red;
    font-size: large;
`;

export const FooterSection = styled.div`
  margin: 16px;
`;
