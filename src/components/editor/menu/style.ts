import styled from 'styled-components';

/* stylelint-disable no-descending-specificity*/
export const Nav = styled.nav`
    padding-left: 15px;
    ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }
`;

export const NavBarMenuItem = styled.li`
    display: block;
    position: relative;

    &:hover {
        background-color: var(--c-editor-light-2);

        button,
        a {
            color: var(--c-editor-dark-1);
        }

        & > ul {
            min-width: 200px;
            display: inline;

            & > ul {
                display: none;
            }
        }
    }

    button,
    a {
        align-items: center;
        background: transparent;
        border: none;
        color: var(--c-editor-light-3);
        cursor: pointer;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        line-height: 32px;
        padding: 0 var(--s-double);
        width: 100%;

        &:hover + ul {
            /*display: block;*/
        }
    }

    ul {
        background-color: var(--c-editor-light-3);
        display: none;
        flex-direction: column;
        position: absolute;
        white-space: nowrap;
        z-index: 9999;

        li {
            button,
            a {
                color: var(--c-editor-dark-1);
                display: inline-flex;

                &:hover {
                    background-color: var(--c-editor-light-2);
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

        hr {
            background-color: var(--c-editor-light-2);
            border: none;
            height: 2px;
            margin: 0;
        }
    }
`;

export const Title = styled.span`
    align-items: center;
    display: flex;
`;

export const Icon = styled.span`
    display: inline-block;
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

export const Shortcut = styled.span`
    color: var(--c-editor-light-1);
    font-size: 10px;
    font-weight: var(--f-normal);
    margin-left: var(--s-base);
    text-transform: uppercase;
`;

export const Disabled = styled.div`
    pointer-events: none;

    /* for "disabled" effect */
    opacity: 0.7;
    color: #ccc;
`;

/* stylelint-enable */
