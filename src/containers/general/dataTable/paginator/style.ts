import styled from 'styled-components';

export const PaginatorStyle = styled.div`
    display: flex;
    align-items: center;

    padding: 7px;
    justify-content: space-around;
    max-width: fit-content;
    margin: 0 auto;
`;

export const ShowStyle = styled.div`
    margin-right: 10px;
`;

export const ShowText = styled.label`
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: OpenSans-Regular, sans-serif;
    font-weight: normal;
    height: 16px;
    letter-spacing: 0.2px;
    line-height: 14px;
    width: 32px;
    margin-right: 10px;
`;

export const ShowSelect = styled.select`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    border-radius: 4px;

    position: relative;

    & > option {
        color: ${({ theme }) => theme.colors.text.primary};
        background-color: ${({ theme }) => theme.colors.background.panel};
    }
`;

export const PaginatorBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
`;

export const PaginatorItem = styled.div`
    float: left;
    list-style: none;
    margin-right: 10px;
    cursor: pointer;
`;

export const PaginatorNumber = styled.span<{ selectedPage: boolean }>`
    font-weight: ${(props) => (props.selectedPage ? 'bold' : 'normal')};
`;
