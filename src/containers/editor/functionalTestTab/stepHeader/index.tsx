import React, { useRef, useState} from "react";
import AutomatedTestStep from "../../../../lib/domain/entities/automatedTestItems/automatedTestStep";
import PopOverMenu, {ButtonAction} from "../../../../components/general/popOverMenu";
import StepFields from "./stepFields";
import { TypeField, ValueType } from "../index";
import {  } from 'react-feather';
import {
    StepFieldsContainer,
    ButtonActionStep,
    RunStepIcon,
    MoveStepUpIcon,
    MoveStepDownIcon,
    RemoveStepIcon, EnableStepIcon, DisableStepIcon
} from "./style";

interface StepHeaderProps {
    automatedTestStep: AutomatedTestStep,
    isRunning: boolean,
    handleTypeChange(field: TypeField, value : ValueType, editorWillChange?: boolean) : void,
    runStep() : void,
    moveStep(delta: number) : void,
    toggleStep() : void,
    removeStep() : void,
    load(cb: (...args: any[]) => any) : (...args: any[]) => Promise<any>
}

const StepHeader = ({ automatedTestStep,
                      isRunning,
                      handleTypeChange,
                      runStep,
                      moveStep,
                      toggleStep,
                      removeStep, load } : StepHeaderProps) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [openAction, setOpenAction] = useState(false);

    return (
       <StepFieldsContainer>
           <StepFields
               automatedTestStep={automatedTestStep}
               handleTypeChange={handleTypeChange}
               load={load}
           />
           <ButtonActionStep>
                <ButtonAction
                    type='secondary'
                    anchorRef={anchorRef}
                    openAction={openAction}
                    onClick={() => setOpenAction((isPrevOpen) => !isPrevOpen)}
                    disabled={isRunning}
                    showIcon
                />

                <PopOverMenu openAction={openAction}
                             setOpenAction={setOpenAction}
                             anchorRef={anchorRef}
                             itemsMenu={[
                                         {
                                             label: 'Run step',
                                             startIcon: <RunStepIcon />,
                                             onClick: () => {
                                                setOpenAction(false);
                                                runStep();
                                             }
                                         },
                                         {
                                             label: 'Move up',
                                             startIcon: <MoveStepUpIcon />,
                                             onClick: () => {
                                                 setOpenAction(false);
                                                 moveStep(-1);
                                             }
                                         },
                                         {
                                             label: 'Move down',
                                             startIcon: <MoveStepDownIcon />,
                                             onClick: () => {
                                                 setOpenAction(false);
                                                 moveStep(1);
                                             }
                                         },
                                         {
                                             label: `${ automatedTestStep.disabled ? 'Enable' : 'Disable' }`,
                                             startIcon:  automatedTestStep.disabled ? <EnableStepIcon /> : <DisableStepIcon />,
                                             onClick: () => {
                                                 setOpenAction(false);
                                                 toggleStep();
                                             }
                                         },
                                         {
                                             label: 'Remove',
                                             startIcon: <RemoveStepIcon />,
                                             onClick: () => {
                                                 setOpenAction(false);
                                                 removeStep();
                                             }
                                         }]}
                             handleClose={(_) => setOpenAction(false) }
                />
           </ButtonActionStep>
       </StepFieldsContainer>
   );
}

StepHeader.defaultProps = {
    isRunning: false
}

export default StepHeader;