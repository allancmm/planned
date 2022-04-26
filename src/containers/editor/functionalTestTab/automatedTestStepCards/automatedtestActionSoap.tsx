import React, { ChangeEvent } from 'react';
import InputText from "../../../../components/general/inputText";
import produce, { Draft } from 'immer';
import AutomatedTestActionSoap from '../../../../lib/domain/entities/automatedTestItems/automatedTestActionSoap';
import { StepFieldContainer } from "../style";
import YesNo from "../../../../lib/domain/enums/yesNo";
import Label from "../../../../components/general/label";

interface AutomatedTestAssessmentSqlCardProps {
    actionSoap: AutomatedTestActionSoap;
    disabled: boolean;
    handleStepChildChange(assessmentSql: AutomatedTestActionSoap): void;
}

const AutomatedTestActionSoapCard = ({ actionSoap, disabled, handleStepChildChange }: AutomatedTestAssessmentSqlCardProps) => {
    const editStep = (recipe: (draft: Draft<AutomatedTestActionSoap>) => void) => {
        const newCard = produce(actionSoap, recipe);
        handleStepChildChange(newCard);
    };

    const handleChangeUseDatafile = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        editStep((draft) => {
            if (e.target.checked) {
                draft.xml = '';
            } else {
                draft.dataFileName = '';
            }
            draft.useDataFile = e.target.checked;
        });
    };

    return (
        <>
            <StepFieldContainer>
                <Label text='Use datafile?' className='custom-label' />
                <InputText
                    label=''
                    type='checkbox'
                    options={[{ label: actionSoap.useDataFile ? YesNo.Yes : YesNo.No, value: 'datafile', disabled }]}
                    checkedValues={[ actionSoap.useDataFile ? 'datafile' : '' ]}
                    onChange={handleChangeUseDatafile}
                    disabled={disabled}
                />
            </StepFieldContainer>
            {actionSoap.useDataFile && (
                <StepFieldContainer>
                    <InputText
                        type='text'
                        label='DataFile name'
                        value={actionSoap.dataFileName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            editStep((draft) => {
                                draft.dataFileName = e.target.value;
                            })
                        }
                        disabled={disabled}
                    />
                </StepFieldContainer>
            )}
        </>
    );
};

export default AutomatedTestActionSoapCard;
