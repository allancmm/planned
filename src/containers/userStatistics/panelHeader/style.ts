import styled from 'styled-components';

export const ButtonSection = styled.div`
    margin: 0;
    padding: 0;
    display: flex;  
    flex-wrap: wrap;    
    justify-content: flex-end; 
    & button {
       margin: 0 0 0 16px;
    }
`;

export const ButtonContainer = styled.div`
   display: flex;
   height: 100%;
`;

export const ButtonContent = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 6px;
`;

export const MultiSelectContainer =  styled.div`
   > div {
      border: 1px solid #60666E;
   }   
`;
