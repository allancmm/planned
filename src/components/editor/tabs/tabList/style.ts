import styled from 'styled-components';
import { Lock } from "react-feather";

interface TabProps {
    show: boolean;
    focus: boolean;
}

export const Tabs = styled.div`
    display: flex;
    position: relative;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borders.primary};
    flex: 0 0 24px;
    background-color: ${({ theme }) => theme.colors.background.tabs.main};

    :first-child(button) {
        margin-left: auto;
    }
    button {
        width: 24px;
        background: transparent;
        border: none;
        color: ${({ theme }) => theme.colors.text.primary};
        cursor: pointer;

        height: 24px;
        flex: 0 0 24px;
    }
`;

export const TabsList = styled.div`
    display: flex;
    overflow-x: auto;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

export const TabButton = styled.div<TabProps>`
    align-items: center;
    background-color: ${({ show, theme }) =>
        show ? theme.colors.background.tabs.accent : theme.colors.background.tabs.main};

    color: ${({ show, focus, theme }) => (show && focus ? theme.colors.text.primary : theme.colors.text.tertiary)};
    cursor: pointer;
    display: flex;
    font-weight: 550;
    height: 100%;
    line-height: 24px;
    outline: none;
    padding: 0 3px;
    max-width: 300px;

    & > span:first-of-type {
        display: block;
        flex: 1 1 auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
    }
`;

export const CloseButton = styled.button`
    svg {
        stroke-width: 4;
    }
`;

const StatusBadge = styled.div`
    display: block;
    flex: 0 0 10px;
    border-radius: 50%;
    height: 10px;
    margin-left: var(--s-double);
    width: 10px;
`;

export const CheckedInBadge = styled(StatusBadge)`
    background-color: greenyellow;
`;

export const CheckedOutByMeBadge = styled(StatusBadge)`
    background-color: orange;
`;

export const CheckedOutBadge = styled(StatusBadge)`
    background-color: red;
`;

export const SplitButton = styled.button`
    padding: 1px 0;
    & > svg {
        height: 20px;
        width: 20px;
    }
`;

export const IconLock = styled(Lock)`
    flex: 0 0 10px;
    margin-left: var(--s-double);
`;
