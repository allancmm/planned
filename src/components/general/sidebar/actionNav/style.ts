import styled from 'styled-components';

export const ActionNav = styled.nav`
    padding-left: 15px;
    position: relative;
    
    ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }
`;

export const ActionNavItem = styled.span`
    display: block;

    &:hover {
        background-color: ${({ theme }) => theme.colors.background.panelHeader};

        span {
            color: ${({ theme }) => theme.colors.text.primary};
        }

        & > ul {
            display: inline;

            & > ul {
                display: none;
            }
        }
    }

    ul {
        background-color: ${({ theme }) => theme.colors.background.subPanelHeader};
        display: none;
        flex-direction: column;
        position: absolute;
        white-space: nowrap;
        z-index: 9999;
        right: 0; /* TODO: remove when solving dropdown menu issue in overflowing container */

        li {
            span {
                color: ${({ theme }) => theme.colors.text.primary};
                display: inline-flex;
                vertical-align: top;
                align-items: center;
                background: transparent;
                border: none;
                cursor: pointer;
                font-weight: 600;
                justify-content: space-between;
                line-height: 20px;
                padding: 0 var(--s-half);
                width: 100%;

                &:hover {
                    background-color: ${({ theme }) => theme.colors.background.panelHeader};
                }

                &:disabled {
                    opacity: 0.5;

                    &:hover {
                        background-color: transparent;
                        cursor: default;
                    }
                }
            }
        }
    }
`;

export const NavItem = styled.span`
    align-items: center;
    display: flex;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
    line-height: 20px;
    padding: 0 var(--s-double);
`;

export const Title = styled.span`
    align-items: center;
    display: flex;
`;

export const Icon = styled.span`
    display: inline-block;
    font-size: 16px;
    font-weight: var(--f-bold);
    margin-right: var(--s-base);
    width: var(--s-double);

    &:empty {
        margin: 0;
        width: 0;
    }

    > svg {
        height: 14px;
        width: 14px;
    }
`;

export const RIcon = styled.span`
    display: inline-block;
    font-size: 16px;
    font-weight: var(--f-bold);
    margin-left: var(--s-base);
    width: var(--s-double);

    &:empty {
        margin: 0;
        width: 0;
    }

    > svg {
        height: 14px;
        width: 14px;
    }
`;
