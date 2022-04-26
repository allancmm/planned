import styled from "styled-components";

export const TypeTestContainer = styled.div`
    margin-top: 4px;
    margin-left: 18px; 
    cursor: pointer; 
 `;

export const FolderContainer = styled.div`
    display: flex;
    align-items: center;
    .content {
       display: flex;
       align-items: center;
       width: 85%;
    }
    .menu-actions {
       float: right;
    }
`;

export const DraggableTemplateItemContainer = styled.div`
    align-items: center;
    margin-top: 4px;
    margin-left: 18px;
    width: 100%;
    .menu-actions {
       float: right;
    }
`;

export const TemplatesContainer = styled.div`
  padding-bottom: 16px;
  .input-add-folder {
     padding: 0 16px;
  }
`;