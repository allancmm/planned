import React, {ChangeEvent} from 'react';
import produce, { Draft } from 'immer';
import InputText from "../../../../components/general/inputText";
import AutomatedTestAssessmentFileCompare from '../../../../lib/domain/entities/automatedTestItems/automatedTestAssessmentFileCompare';
import { StepFieldContainer } from "../style";

interface AutomatedTestAssessmentFileCompareProps {
    assessmentFileCompare: AutomatedTestAssessmentFileCompare;
    disabled: boolean
    handleStepChildChange(assessmentFileCompare: AutomatedTestAssessmentFileCompare): void;
}

const AutomatedTestAssessmentFileCompareCard = ({
    assessmentFileCompare,
    disabled,
    handleStepChildChange,
}: AutomatedTestAssessmentFileCompareProps) => {
    const editStep = (recipe: (draft: Draft<AutomatedTestAssessmentFileCompare>) => void) => {
        const newCard = produce(assessmentFileCompare, recipe);
        handleStepChildChange(newCard);
    };

    return (
        <StepFieldContainer>
            <InputText
                label='Actual Result Variable'
                value={assessmentFileCompare.fileToCompare ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    editStep((draft) => {
                        draft.fileToCompare = e.target.value;
                    })
                }
                disabled={disabled}
            />
        </StepFieldContainer>
    );
};

export default AutomatedTestAssessmentFileCompareCard;
