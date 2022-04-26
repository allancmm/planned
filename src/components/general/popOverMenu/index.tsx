import React, {RefObject} from "react";
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";
import { PopOverMenuContainer } from "./style";
import { Button, Icon } from "@equisoft/design-elements-react";

export interface ItemPopOverMenu {
    label: string,
    value?: string,
    disabled?: boolean
    startIcon?: JSX.Element
    onClick(event: React.MouseEvent<HTMLLIElement, MouseEvent>, dialog: string) : void,
}

export interface PopOverMenuProps {
    anchorRef: RefObject<HTMLDivElement>,
    openAction: boolean,
    itemsMenu: ItemPopOverMenu[],
    isCloseAfter?: boolean,
    setOpenAction(open: boolean) : void,
    handleClose(e?:  React.MouseEvent<Document, MouseEvent>) : void,
}

const PopOverMenu = ({openAction, anchorRef, itemsMenu, isCloseAfter, setOpenAction, handleClose } : PopOverMenuProps) => {
    const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenAction(false);
        }
    };
    return(
        <PopOverMenuContainer>
            <Popper open={openAction} anchorEl={anchorRef.current} role="" transition disablePortal>
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={openAction} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    {itemsMenu.map( ({ label, value, onClick, disabled, startIcon}, index)  =>
                                        <MenuItem
                                            key={index}
                                            onClick={(e) => {
                                                isCloseAfter && handleClose();
                                                onClick(e, value ?? label);
                                            }}
                                            disabled={disabled}
                                        >
                                            <>
                                                {startIcon &&
                                                    <div className='start-icon' >
                                                        {startIcon}
                                                    </div>
                                                }
                                                {label}
                                            </>
                                        </MenuItem>
                                    )}

                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </PopOverMenuContainer>
    )
}

export default PopOverMenu;

type ButtonType = "primary" | "secondary" | "tertiary" | "destructive";

interface ButtonActionProps {
    anchorRef: RefObject<HTMLDivElement>,
    openAction: boolean,
    disabled?: boolean,
    type?: ButtonType,
    label?: string,
    showIcon?: boolean,
    onClick() : void,
}

export const ButtonAction = ({ anchorRef, openAction, onClick, disabled = false, label = 'Actions', type = 'tertiary', showIcon = false } : ButtonActionProps) =>
    <div>
        <Button
            buttonType={type}
            aria-controls={openAction ? 'menu-list-grow' : ''}
            aria-haspopup
            disabled={disabled}
            onClick={onClick}
            ref={anchorRef}
        >
            <span>{label}</span>
            {showIcon && <Icon name={openAction ? 'chevronUp' : 'chevronDown'} size={16}/>}
        </Button>
    </div>

export { IconMenuStyle } from "./style";