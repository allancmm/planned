import { CheckSquare, Square } from 'react-feather';
import styled, { css } from 'styled-components';

export const ReviewersContainer = styled.div``;

export const ReviewerStyle = styled.div<{ selectable: boolean }>`
    cursor: ${(props) => (props.selectable ? 'pointer' : 'initial')};
    margin-bottom: var(--spacing-half);
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const IconStyle = css`
    width: 12px;
    height: 12px;
    margin-right: 10px;
    stroke-width: 3;
`;

export const UserIcon = styled(Square)`
    ${IconStyle}
`;

export const UserCheckIcon = styled(CheckSquare)`
    ${IconStyle}
`;

export const StyledForm =  styled.form``;

export const ButtonSection = styled.div`
   margin-top: var(--spacing-2x);
`;

export const ReviewerEditStyle = styled.div<{ selectable: boolean }>`
    cursor: ${(props) => (props.selectable ? 'pointer' : 'initial')};
    padding: 5px;
    margin: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;