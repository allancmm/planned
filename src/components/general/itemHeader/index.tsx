import React  from "react";
import { LabelContainer, ValueContainer } from "./style";
import { TextEllipsis } from "../index";
import {Tooltip} from "@material-ui/core";

interface ItemHeaderProps {
    value: string,
    label: string
}

const ItemHeader = ({ value, label } : ItemHeaderProps) =>
    <>
        <ValueContainer>
            <Tooltip title={value || 'N/A'} placement={'bottom-start'}>
                <TextEllipsis>{value || 'N/A'}</TextEllipsis>
            </Tooltip>
        </ValueContainer>

        <LabelContainer>{label}</LabelContainer>
    </>

export default ItemHeader;

export { LabelContainer, ValueContainer  };