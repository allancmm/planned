import React from "react";
import { InputText, Options } from "../../../../components/general";

interface TemplateComponentProps {
    name?: string,
    options: Options[],
    disabled?: boolean,
    onChange(value: string) : void
}
const TemplateComponent = ({ name = '', options, disabled = false, onChange } : TemplateComponentProps) =>
        <InputText
            type='custom-select'
            value={name}
            label="Template"
            disabled={disabled}
            options={options}
            onChange={(o : Options) => onChange(o.value)}
        />;

export default TemplateComponent;