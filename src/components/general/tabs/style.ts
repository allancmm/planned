import styled from 'styled-components';

interface TabProps {
    show: boolean;
}

export const TabLabel = styled.div``;

export const TabButton = styled.th<TabProps>`
    background-color: ${(props) => (props.show ? 'red' : 'inhert')};
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 14px 16px;
`;
