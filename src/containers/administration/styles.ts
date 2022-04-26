import styled from "styled-components";
import DataTable from "../general/dataTable/table";

export const AdministrationContainer = styled.div`
   margin: 20px;
`;

export const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-y: auto;
    margin: auto;
`;

export const Panel = styled.div`
    white-space: pre;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    background-color: ${(props) => props.theme.colors.background.panel};
    color: ${(props) => props.theme.colors.text.primary};
    margin: 0.5% 0.25%;
    width: 99.5%;    
    display: flex;
    flex-direction: column;
`;

export const PanelGrid = styled(DataTable)`
    overflow-x: visible;
`;

export const ButtonSection = styled.div`
    padding: 4px 0px;
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

export const AdmPanelContainer = styled.div`   
   padding: 8px 0 16px 0;
   .list-container {
      span {
         margin: 0 16px;
      }
   }
   
   .pagination-custom {
     padding: 12px 16px 0;
   }
`;

export const UserPanelContainer = styled.div<{ heightDataGrid: number }>`
   height: ${({ heightDataGrid }) => heightDataGrid}px;
   height: 370px;
   padding: 16px;
`;
