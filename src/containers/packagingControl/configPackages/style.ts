import styled from 'styled-components';

export const ConfigPackageTable = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: nowrap;

    & > div {
        width: 30%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
