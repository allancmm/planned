import styled from "styled-components";

export const DraggableContainer = styled.div<{ opacity: number }>`
    opacity: ${({ opacity }) => opacity};
    width: 100%; 
    display: flex;
`;