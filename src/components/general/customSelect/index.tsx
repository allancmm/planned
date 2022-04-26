import React from "react";
import { SelectEnvContainer } from "../miscellaneous";
import { Options } from "../index";

interface CustomSelectProps {
    value: string;
    options: Options[],
    disabled?: boolean,
    onChange: Function,
}

export const CustomSelect = ({ value, options, disabled, onChange } : CustomSelectProps) =>
        <SelectEnvContainer>
            <select
                value={value}
                onChange={(e) => onChange({ value: e.target.value})}
                disabled={disabled}
            >
                {options.map((e) => (
                    <option key={e.value} label={e.label} value={e.value}>
                        {e.label}
                    </option>
                ))}
            </select>
        </SelectEnvContainer>;

export default CustomSelect;