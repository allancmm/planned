import React from "react";
import { TextInput } from "equisoft-design-ui-elements";
import { Search } from "react-feather";
import { InputSearchWrapper } from "./style";

interface InputSearchProps {
    value: string,
    placeholder: string,
    onChange(value: string) : void
}

const InputSearch = ({ value, placeholder, onChange } : InputSearchProps) => {
    return(
        <InputSearchWrapper>
            <TextInput
                value={value}
                type="text"
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
            <button type="button">
                <Search />
            </button>
        </InputSearchWrapper>
    );
}

InputSearch.defaultProps = {}

export default InputSearch;