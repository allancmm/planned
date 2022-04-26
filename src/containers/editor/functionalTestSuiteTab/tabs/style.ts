import styled from "styled-components";

export const CustomTabContainer = styled.div`         
   .tab-buttons-container {
        align-items: center;
        border-bottom: 1px solid #878f9a;
        display: flex;
        margin-bottom: var(--spacing-1x);
        cursor: text;
    }
   
   .tab-button {
        align-items: center;
        bottom: -1px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        line-height: 1.5rem;
        min-height: 48px;
        min-width: 82px;
        padding-left: var(--spacing-2x);
        padding-right: var(--spacing-2x);
        position: relative;
        z-index: 1;
   }
   
    .tab-button::after {
        content: '';
        background-color: #006296;
        bottom: 0;
        display: block;
        height: 4px;
        left: 0;
        position: absolute;
        width: 100%;
    }
    
   button {
        appearance: none;
        background-color: transparent;
        border: none;
        margin: 0;
        padding: 0;
        cursor: text !important
    }
    
   .tab-name {
        color: #006296;
        font-family: Open Sans,sans-serif;
        font-size: 0.875rem;
        -webkit-text-stroke-width: 0.4px;
    }
    
   .tab-content {
      height: calc(100% - 60px);
      overflow-x: hidden;
      overflow-y: auto;
   }  
   
   svg {
     margin-left: 6px;
     width: 20px;
     height: 20px;
   }  
`;