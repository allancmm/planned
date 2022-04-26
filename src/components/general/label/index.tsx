import React from "react";

import { LabelStyle } from "./style";

interface LabelProps {
    text: string,
    required: boolean,
    className: string,
}

const Label = ({ text, required, className } : LabelProps) =>
    <LabelStyle required={required} className={className}>{text}</LabelStyle>;

Label.defaultProps = {
    text: '',
    required: false,
    className: ''
};
export default Label;