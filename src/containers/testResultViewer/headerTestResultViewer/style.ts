import styled from "styled-components";


export const TestResultHeaderContainer = styled.div`
    .container {
       padding: 16px; 
       margin-bottom: 8px;
    }
    
    .content {
       display: flex;
       flex-direction: row;
    }
    
    .test-suit-name {
       display: flex;
       span:first-child {
          font-weight: bold; 
          margin-right: 5px;
       }
       span + span {
          display: inline-block;
          text-overflow: ellipsis;
          width: 70%;
          white-space: nowrap;
          overflow: hidden;
       }
    } 
    
    .execution-time {
       display: flex;
       span:first-child {
          font-weight: bold; 
          margin-right: 5px;
       }
    }   
    
    .results {
       display: flex;
       flex-direction: row;
       span:first-child {
          font-weight: bold; 
          margin-right: 5px;
       }
    }
    
    .result-content {
       display: flex;
       flex-direction: row;
    }
    
    .result-item {
       display: flex;
       margin-right: 18px;
       cursor: default;
       & span {
           margin-left: 6px;
       }
    }
`;