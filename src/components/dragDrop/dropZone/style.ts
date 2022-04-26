import styled from "styled-components";

export const DropZoneContainer = styled.div`
   .dropZone {
        flex: 0 0 auto;
        height: 5px;
        transition: 200ms all;
    }
    
    .dropZone:nth-of-type(2n) {
        display: none;
    }
    
    .dropZone.horizontalDrag {
        width: 40px;
        height: auto;
    }
    
    .dropZone:not(.horizontalDrag).isLast {
        flex: 1 1 auto;
    }
    
    .dropZone.active {
        background: #00a2ff;
        height: 20px;
        transition: 100ms all;
    }
`;