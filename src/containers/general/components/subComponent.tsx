import React, { useMemo } from 'react';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import { InputText, Options } from "../../../components/general";

interface SubComponentProps {
    title: string;
    value: string;
    required: boolean;
    typeComponent: string,
    optionElements: BasicEntity[];
    feedbackMsg?: string,
    handleChanges(value: string, typeComponent: string): void;
}


const SubComponent = ({ title, value = '', required, typeComponent, optionElements, feedbackMsg = '', handleChanges }: SubComponentProps) => {
    const onChange = (o: Options) => {
        handleChanges(o.value, typeComponent);
    }

    const optionsElements = useMemo(() =>
        [{label: optionElements.length > 0 ? `Select ${title}` : `No ${title} Available`, value: '' },
        ...optionElements.map((c) => ({
                label: c.name,
                value: c.value,
            }))]
        , [optionElements]);
    return (
        <InputText
            type='custom-select'
            value={value}
            feedbackMsg={feedbackMsg}
            label={title}
            disabled={optionElements.length === 0}
            options={optionsElements}
            onChange={onChange}
            required={required}
        />
    )

};


export default SubComponent;