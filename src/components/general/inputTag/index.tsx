import React, {CSSProperties, KeyboardEvent} from "react";
import Label from "../label";
import Creatable from "react-select/creatable";
import { InputTagContainer } from "./styles";
import { useTheme } from "../hooks";

interface InputTagProps {
    label: string,
    inputTag: string,
    value: { label: string, value: string }[],
    placeholder?: string,
    handleTagChange(value: any): void,
    onInputChange(value: string): void,
    handleTagKeyDown(e: KeyboardEvent<HTMLElement> ): void
}

const InputTag = ({ label = '',
                    inputTag,
                    value,
                    placeholder = '',
                    handleTagChange,
                    onInputChange,
                    handleTagKeyDown } : InputTagProps) => {
    const { currentTheme } = useTheme();
    const customStyles = {
        control: (base : CSSProperties, state: { [key: string]: any }) => ({
            ...base,
            background: currentTheme.colors.background.panel,
            borderRadius: '5px',
            border: '1px solid #60666E',
            minHeight: '34px',
            ...(state.isFocused ? {
                outline: 'none',
                borderColor: '#006296',
                borderWidth: '1px',
                boxShadow: '0 0 0 2px #84C6EA',
            } : {}),
            '&:hover': {
                border: '1px solid #60666E',
                cursor: 'text',
                svg: {
                    cursor: 'pointer',
                }
            },
        }),
        multiValue: (base: CSSProperties ) => ({
            ...base,
            borderRadius: '10px',
        })
    };

    return (
        <InputTagContainer>
            <Label text={label}/>
            <Creatable
                inputValue={inputTag}
                value={value}
                components={{DropdownIndicator: null}}
                isClearable
                isMulti
                placeholder={placeholder}
                menuIsOpen={false}
                onChange={handleTagChange}
                onInputChange={onInputChange}
                onKeyDown={handleTagKeyDown}
                styles={customStyles}
            />
        </InputTagContainer>
    );
};


export default InputTag;