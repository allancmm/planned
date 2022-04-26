import React from "react";
import { Label, SelectEnvContainer } from "../../../components/general";

interface SelectEnvironmentProps {
    value: string;
    label: string,
    options: {label: string, value: string}[],
    onChange(option: string) : void,
}

export const SelectEnvironment = ({ value, label, options, onChange } : SelectEnvironmentProps) => {
    return (
        <SelectEnvContainer>
            <Label text={label} />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
            disabled={options.length === 0}
            >
                {options.length > 0 ? (
                    [
                        <option label="Select One" value="" key="empty">
                            Select One
                        </option>,
                        ...options.map((e) => (
                            <option key={e.value} label={e.label} value={e.value}>
                                {e.label}
                            </option>
                        )),
                    ]
                ) : (
                    <option key="None" label="No environments for user" value="" disabled>
                        No environments for user
                    </option>
                )}
            </select>
        </SelectEnvContainer>
    );
}

export default SelectEnvironment;