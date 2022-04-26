import styled from 'styled-components';

export const HistoryHeaderContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;

    > div {
        width: 45%;
    }
`;

export const HalfWidthContainer = styled.div`
    margin-top: var(--s-base);
    
    & > div:first-of-type {
        width: 50%;
        padding-right: 10px;
        float: left;
    }
    
    & > div {
        width: 50%;
        margin-top: 0 !important;
        float: left;
    }
`;
