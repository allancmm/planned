import styled from 'styled-components';

export const CreateMigrationSetForm = styled.form`
    margin: 0 var(--spacing-1x);
`;

export const TargetContainer = styled.div`
   width: 30%;
`;

export const PackageListSection = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 var(--spacing-1x);

    div {
        display: flex;
    }
`;

export const PackageListContainer = styled.div`
   margin-top: var(--s-half);
`;

export const ButtonSection = styled.div`
   button:first-of-type {
      margin-right: var(--spacing-2x);
   }
`

export const ListMigrationContainer = styled.div`
    > div {
       margin-left: var(--s-half);
    }
`;
