import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import produce, { Draft } from 'immer';
import InputText from "../../../../components/general/inputText";
import AutomatedTestCase from '../../../../lib/domain/entities/automatedTestItems/automatedTestCase';
import { TestCaseDetailsForm } from './style';
import { CollapseContainer } from "equisoft-design-ui-elements";
import { toast } from "react-toastify";
import InputTag from "../../../../components/general/inputTag";

interface AutomatedTestCaseHeaderProps {
    automatedTestCase: AutomatedTestCase;
    handleInputChange(automatedTestCase: AutomatedTestCase): void;
}

const AutomatedTestCaseDetails = ({ automatedTestCase, handleInputChange }: AutomatedTestCaseHeaderProps) => {
    const [inputTag, setInputTag] = useState('');

    const editCase = (recipe: (draft: Draft<AutomatedTestCase>) => void) => {
        handleInputChange(produce(automatedTestCase, recipe));
    };

    const handleTagChange = async (value: any) => {
        const newValue = value !== null ? value.map((v: any) => v.value) : [];
        editCase((draft) => {
            draft.tags = [...newValue];
        });
    }

    const handleTagKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
        if (!inputTag) return;

        switch (event.key) {
            case 'Enter':
            case 'Tab':
                if(!automatedTestCase.tags.find((t) => t === inputTag)){
                    editCase((draft) => {
                        draft.tags.push(inputTag);
                    });
                } else {
                    toast.error(`Tag ${inputTag} already exists`);
                }
                setInputTag('');
        }
    }, [inputTag]);

    return (
        <CollapseContainer title='Description' defaultOpened>
            <TestCaseDetailsForm>
                <InputText
                    label='Name'
                    classNameInput='inner-fields'
                    value={automatedTestCase.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        editCase((draft) => {
                            draft.name = e.target.value;
                        })
                    }
                />
                <InputText
                    type='textarea'
                    label='Description'
                    classNameInput='inner-fields'
                    value={automatedTestCase.description ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        editCase((draft) => {
                            draft.description = e.target.value;
                        })
                    }
                />
                <InputText
                    label='Keyword'
                    classNameInput='inner-fields'
                    value={automatedTestCase.keyword ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        editCase((draft) => {
                            draft.keyword = e.target.value;
                        })
                    }
                />

                <InputTag
                    label='Tags'
                    inputTag={inputTag}
                    value={automatedTestCase.tags.map((t) => ({ label: t, value: t }))}
                    handleTagChange={handleTagChange}
                    onInputChange={setInputTag}
                    handleTagKeyDown={handleTagKeyDown}
                />
            </TestCaseDetailsForm>
        </CollapseContainer>
    );
};

export default AutomatedTestCaseDetails;
