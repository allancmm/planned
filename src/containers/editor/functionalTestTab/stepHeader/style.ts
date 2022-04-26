import styled from "styled-components";
import { IconMenuStyle } from "../../../../components/general/popOverMenu";
import { Play, ArrowDown, ArrowUp, Trash, MinusCircle, Check } from "react-feather";

export const StepFieldContainer = styled.div`
  padding-right: 50px;
`
export const StepFieldsFixedContainer = styled.div`
    display: flex;
    padding: 0 16px;
    width: 80%;
`;

export const StepFieldsContainer = styled.div`
   display: flex; 
   flex-direction: row;
`;

export const ButtonActionStep = styled.div`
    width: 20%;
    margin: 20px 0 0;
    padding: 0 16px;
    display: flex;  
    flex-wrap: wrap;    
    justify-content: flex-end; 
    span {
       margin-right: 5px;
    }
`;

export const RunStepIcon = styled(Play)`
   ${IconMenuStyle};
`;

export const MoveStepUpIcon = styled(ArrowUp)`
   ${IconMenuStyle};
`;

export const MoveStepDownIcon = styled(ArrowDown)`
   ${IconMenuStyle};
`;

export const RemoveStepIcon = styled(Trash)`
   ${IconMenuStyle};
`;

export const EnableStepIcon = styled(Check)`
   ${IconMenuStyle};
`;

export const DisableStepIcon = styled(MinusCircle)`
   ${IconMenuStyle};
`;