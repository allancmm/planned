import styled from 'styled-components';

export const HeaderContainer = styled.header`
    background-color: ${(props) => props.theme.colors.background.header};
    color: ${(props) => props.theme.colors.text.header};
    display: flex;
    justify-content: start;
    grid-area: header;
    z-index: 4;
`;

export const HeaderElement = styled.ul`
    list-style: none;
    position: relative;
    display: flex;
    margin: 0;
    padding: 0;

    & > li {
        padding: 0 8px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
    }
`;

export const LogoEquisoft = styled.img`
    display: inline-block;
    flex: 0 0 auto;
    margin: 0px 16px 0px 20px;
    width: 115px;
    height: 48px;
    z-index: 1;
`;

export const MenusContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    padding-right: 16px;
`;
