import styled from 'styled-components';

export const MainContent = styled.main`
    grid-area: main;
    display: flex;
    background-color: ${(props) => props.theme.colors.background.main};
`;

export const Wrapper = styled.div`
    height: 100vh;
    display: grid;
    grid-template-areas: 'header' 'main' 'footer';
    grid-template-rows: var(--spacing-6x) minmax(0, 1fr) var(--spacing-4x);
    grid-template-columns: 100vw;
`;