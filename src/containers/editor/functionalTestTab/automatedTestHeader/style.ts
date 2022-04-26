import styled from "styled-components";

export const AutomatedTestHeaderContainer = styled.div<{ saved? : boolean }>`    
    .card-container {
       padding: 16px; 
       margin-bottom: 8px;
    }
        
    .card-content-path {
       display: flex;
       span:first-child {
          font-weight: bold; 
          margin-right: 5px;
       }
    }
    
    .card-content-status {
        span:first-child {
           font-weight: bold;
        }
        span:nth-child(2) {
            margin-left: 5px;
            color: ${({ saved }) => saved ? 'green' : 'red' }
        }
    }
`;

export const ButtonActionSection = styled.div`
    margin: 0;
    padding: 0;
    display: flex;  
    flex-wrap: wrap;    
    justify-content: flex-end; 
    & button {
       margin: 0 0 0 16px;
    }
`;