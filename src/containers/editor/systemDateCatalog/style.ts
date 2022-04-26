import styled from 'styled-components';

export const ButtonRightSection = styled.div`
    padding: 20px 0px;
    display: flex;  
    flex-wrap: wrap;    
    > div {
        display: flex;
        align-items: center;
        min-height: 30px;        
    }
   justify-content: flex-end;
   > button {
     margin-left: 10px;
   } 
`;

export const ButtonLeftSection = styled.div`
    padding: 20px 0px;
    display: flex;  
    flex-wrap: wrap;    
    > div {
        display: flex;
        align-items: center;
        min-height: 30px;        
    }
   justify-content: flex-start;
   > button {
     margin-left: 10px;
   } 
`;

export const SystemDateCatalogContainer = styled.div`
   margin: 5px; 
   height: 100%
`;

export const  TableContainer = styled.div`
   height: calc(100% - 80px);
`;