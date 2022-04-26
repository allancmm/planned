import styled from "styled-components";

export const ButtonSearchSection = styled.div`
    padding: 4px 0px;
    display: flex;  
    flex-wrap: wrap;    
    position: absolute;
    bottom: 35px;
    > div {
        display: flex;
        align-items: center;
        min-height: 30px;        
    }
`;

export const ButtonActionSection = styled.div`
    margin: 15px 0;
    padding: 4px 0px;
    display: flex;  
    flex-wrap: wrap;    
    justify-content: flex-end;
    > div {
        display: flex;
        align-items: center;
        min-height: 30px;        
    }   
    & button {
       margin: 0 5px;
    }
`;

export const ButtonSubmitSection = styled.div`
    margin-top: var(--spacing-2x);
    padding-top: var(--spacing-half);
    display: flex;  
    flex-wrap: wrap;    
    > div {
        display: flex;
        align-items: center;
        min-height: 30px;        
    }   
`;

export const TextRow = styled.span`
   font-size: 12px;
`;
