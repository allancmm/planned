import { Button as ButtonDesign } from "@equisoft/design-elements-react";
import styled from 'styled-components';

export const UnitTestContainer = styled.div`
   height: 100%;
   padding: 16px;
   
    > div + div {
       margin-top: 16px;
    }
   
   .data-grid-report-container {
      height: 350px;
      width: 100%;
      
      .MuiDataGrid-row {
         cursor: pointer;
      }
   }     
`;

export const UnitTestRunSection = styled.div` 
    margin-bottom: 16px;  
`;

export const UnitTestSection = styled.div`
    position: relative;
`;

export const CoverageSection = styled.div`
    span {
        display: block;
    }
    span + span {
        margin-top: 16px;
    }
`;

export const RunTestSuiteButton = styled(ButtonDesign)`
    margin-top: 16px;
`;

export const TestCaseList = styled.ul`
    margin-top: 0;
    margin-bottom: 0;
    list-style: none;
    padding-left: 0;

    li + li {
       margin-top: 6px;
    }
    li {
        display: flex;
        justify-content: space-between;

        div {
            display: flex;
            align-items: center;

            * + * {
                margin-left: 4px;
            }
        }
        
        .open-test-case {
            cursor: pointer;
        }
    }
`;
