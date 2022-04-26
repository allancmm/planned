import styled from "styled-components";

export const AdmContent = styled.div`
    border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;   
    padding: var(--s-half) var(--s-base) var(--s-half);
    margin-top: 5px;    
`;

export const AdmLabel = styled.div`    
    display: block;
    font-weight: bold;
    margin-left: 20px
`;

export const ButtonSection = styled.div`
    padding: 4px 0px;
    display: flex;
    min-width: 70vw;    
    flex-wrap: wrap;    
    > div {
        display: flex;
        align-items: center;
        min-height: 30px;        
    }
   justify-content: flex-end;
   margin-bottom: 15px;
`;

export const GroupButtons = styled.div`
   > button {
     margin-left: 10px;
   }   
`;
