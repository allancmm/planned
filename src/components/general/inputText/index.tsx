import React, {ChangeEvent} from 'react';
import { Select, TextInput, Datepicker, CheckboxGroup, RadioButtonGroup, TextArea, StepperInput } from "@equisoft/design-elements-react";
import {toast} from 'react-toastify';
import InvalidField from "./invalidField";
import Label from "../label";
import { FORMAT_DATE_STANDARD } from "../../../lib/util/date";
import {SelectSection, StepperSection, InputContainer} from "./style";
import CustomSelect from "../customSelect";
import {useTheme} from "../hooks";

export type TypeInput = 'password' | 'select' | 'date' | 'checkbox' | 'text' | 'radio' | 'file' | 'textarea' | 'number' | 'custom-select';

export type FileType = '.xlsx'

export class Options {
    label: string = '';
    value: string = '' ;
    checked?: boolean = false;
    disabled?: boolean = false;
    defaultChecked?: boolean = false;

    constructor(label?: string, value?: string, disabled?: boolean) {
        this.label = label || '';
        this.value = value || '';
        this.disabled = disabled || false;
    }
}

interface InputTextProps {
    label?: string,
    value: string | Date | number,
    type: TypeInput,
    defaultValue?: string,
    onChange: Function,
    feedbackMsg?: string,
    options?: Options[],
    checkedValues?: string[],
    disabled: boolean,
    dateFormat?: string,
    maxDate?: Date,
    startDate?: Date,
    classNameInput?: string,
    required?: boolean,
    groupName?: string,
    checkedValue?: string,
    placeholder?: string,
    searchable?: boolean,
    numberOfItemsVisible?: number,
    acceptFile?: FileType,
    maxLength?: number,
}

const validate = (e: ChangeEvent<HTMLInputElement>): boolean => {
    if (e.target.files) {
        const fileExtension = e.target.files[0].name.split('.')[1];
        if(fileExtension === "xlsx") {
            return true;
        } else {
            toast.error(`File ${e.target.files[0].name} is not supported`)
            return false;
        }
    }
    return false;
}

const InputText = ( {label,
                     value,
                     type,
                     defaultValue,
                     onChange,
                     feedbackMsg,
                     options,
                     checkedValues,
                     disabled,
                     dateFormat,
                     maxDate,
                     startDate,
                     classNameInput,
                     required,
                     groupName,
                     checkedValue,
                     placeholder,
                     searchable,
                     numberOfItemsVisible,
                     acceptFile,
                     maxLength
                    } : InputTextProps) => {
    const { isLightTheme } = useTheme();

    const renderInput = () => {
        switch (type){
            case 'select':
                return <SelectSection>
                          <Select value={value || ''}
                               defaultValue={defaultValue}
                               options={options}
                               onChange={onChange}
                               disabled={disabled}
                               placeholder={placeholder}
                               searchable={searchable}
                               numberOfItemsVisible={numberOfItemsVisible}
                               className={classNameInput}
                          />
                </SelectSection>
            case 'custom-select':
                return <CustomSelect value={value as string} options={options ?? []} onChange={onChange} disabled={disabled} />
            case 'date':
                return <Datepicker value={value || ''}
                                   type={type}
                                   defaultValue={defaultValue}
                                   startDate={startDate}
                                   onChange={onChange}
                                   disabled={disabled}
                                   dateFormat={dateFormat}
                                   maxDate={maxDate}
                                   className={classNameInput}
                />
            case 'checkbox':
                return <CheckboxGroup
                            checkboxGroup={options}
                            checkedValues={checkedValues}
                            onChange={onChange}
                            disabled={disabled}
                            className={classNameInput}
                        />
            case 'radio':
                return <RadioButtonGroup
                            groupName={groupName}
                            buttons={options}
                            onChange={onChange}
                            checkedValue={checkedValue}
                            className={classNameInput}
                       />
            case 'file':
                return <TextInput
                            label={`${!label ? 'File:' : ''}`}
                            type="file"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                      e.preventDefault();
                                      if(validate(e)) {
                                          onChange(e)
                                      }
                            }}
                            accept={acceptFile}
                            className={classNameInput}
                       />
            case 'textarea':
                return <TextArea
                          value={value}
                          disabled={disabled}
                          onChange={onChange}
                          className={classNameInput}
                          maxLength={maxLength}
                />
            case "number":
                return <StepperSection>
                           <StepperInput
                               value={value}
                               onChange={onChange}
                               className={classNameInput}
                               disabled={disabled}
                           />
                       </StepperSection>;
            default:
                return <TextInput value={value || ''}
                                  type={type}
                                  defaultValue={defaultValue}
                                  onChange={onChange}
                                  disabled={disabled}
                                  placeholder={placeholder}
                                  className={classNameInput}
                                  autoComplete={'new-password'}
                        />
        }
    }
    return(
        <div>
            <Label text={ label } required={required} />
            { feedbackMsg && <InvalidField controlId='' feedbackMsg={feedbackMsg}/>}
            <InputContainer hasError={!!feedbackMsg} disabled={disabled} isLightTheme={isLightTheme}>
                {renderInput()}
            </InputContainer>
        </div>
    )
};

InputText.defaultProps = {
    value: "",
    type: "text",
    disabled: false,
    dateFormat: FORMAT_DATE_STANDARD,
    maxDate: new Date('2099-01-01'),
    required: false,
    numberOfItemsVisible: 4,
    classNameInput: '',
    acceptFile: '.xlsx',
}
export default InputText;