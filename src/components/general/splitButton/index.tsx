import React, { useRef, useState } from "react";
import { Button } from "@equisoft/design-elements-react";
import {ItemPopOverMenu, PopOverMenu} from "../index";
import {ButtonGroup, } from '@material-ui/core';
import { ArrowDropDown } from "@material-ui/icons";
import { SplitButtonContainer } from "./styles";

type ButtonType = "primary" | "secondary" | "tertiary" | "destructive";

interface ButtonActionProps {
    disabled?: boolean,
    type?: ButtonType,
    label: string,
    showIcon?: boolean,
    itemsMenu: ItemPopOverMenu[],
    onClick() : void,
}

const SplitButton = ({ onClick, disabled = false, label, type = 'tertiary', itemsMenu} : ButtonActionProps) => {
    const [openAction, setOpenAction] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <SplitButtonContainer>
                <ButtonGroup variant="outlined">
                    <Button
                        buttonType={type}
                        aria-controls={openAction ? 'menu-list-grow' : ''}
                        aria-haspopup
                        disabled={disabled}
                        onClick={onClick}
                        ref={anchorRef}
                    >
                        <span>{label}</span>
                    </Button>
                    <Button
                        buttonType={type}
                        disabled={disabled}
                        onClick={() => setOpenAction(true)}
                        className='splitButton--icon'
                    >
                        <ArrowDropDown />
                    </Button>
                </ButtonGroup>
            </SplitButtonContainer>
            <PopOverMenu
                openAction={openAction}
                setOpenAction={setOpenAction}
                anchorRef={anchorRef}
                handleClose={() => setOpenAction(false)}
                itemsMenu={itemsMenu}
                isCloseAfter
            />
        </>
    )}

export default SplitButton;