import styled from "styled-components";

export const StepListContainer = styled.ul`
    margin-top: 7px;
    list-style: none;
    padding: 0;    
    li {          
       display: inline-block;
       text-overflow: ellipsis;
       width: 100%;
       white-space: nowrap;
       overflow: hidden;
        
       .add-test-case {           
          .add-container {
              display: flex;
              padding: 0 16px;
              justify-content: space-between;
          }
          
          .add-input {
             width: 60%;
             input {
                box-sizing: border-box;
                width: 100%;
             }
          } 
          
          .add-buttons {
              width: 40%;
          }
       }            
       .open-test-case {
           display: flex;
           cursor: pointer;
           width: 100%;
       }
        
       .step-content {
           display: flex;
           align-items: center;
           padding-left: 16px;
           width: 85%;           
           span {
              display: inline-block;
              text-overflow: ellipsis;
              width: 90%;
              white-space: nowrap;
              overflow: hidden;
           }
       }
        
       .step-icon {
          margin: auto;
       }
    }   
`;

export const StepContainer = styled.div`
    height: 100%;
`;

// TODO - Allan - add background-color to Theme
export const RowStepContainer = styled.div<{ active: boolean, disabled: boolean }>`
    display: flex;
    width: 100%;
    height: 24px;
    color: ${({ disabled, theme }) => disabled ? theme.greys['mid-grey'] : 'inherit'};
    background-color: ${({ active }) => active ? 'rgb(224, 240, 249)' : 'inherit'};
    font-weight: ${({ active}) => active ? 'var(--font-semi-bold);' : 'inherit'};
    &:hover {
       background: ${({ theme }) => theme.colors.background.hover.nav};
    }
`;

export const EmptyListContainer = styled.div`
      .dropZone {
          height: 150px !important;
      }
   
      .dropZone.active {
          height: 250px !important;
      }
      
      div:first-child {
        padding-bottom: 6px;
      }
`;