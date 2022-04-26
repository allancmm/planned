import React from "react";
import { CancelIcon, CheckIcon, RightButton } from "../../../containers/functionalTest/automatedTestTree/style";

interface InputAddContentProps {
    value: string,
    className?: string,
    setValue(value: string) : void,
    onConfirm() : void,
    onCancel() : void,
}

const InputAddContent = ({ value, setValue, className = '', onConfirm, onCancel } : InputAddContentProps) => {
    return(
        <div className={className}>
            <input type="text" autoFocus
                   defaultValue={value}
                   onClick={(e) => {
                       e?.stopPropagation();
                       e?.preventDefault();
                   }}
                   onChange={(e) => {
                       setValue(e?.target?.value);
                   }}
            />

            <RightButton type="submit" buttonType="tertiary" onClick={onConfirm}>
                <CheckIcon/>
            </RightButton>
            <RightButton buttonType="tertiary" onClick={onCancel}>
                <CancelIcon/>
            </RightButton>
        </div>
    );
}

export default InputAddContent;