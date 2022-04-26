import React, { ChangeEvent } from "react";
import SwitchMaterialUi from '@material-ui/core/Switch';
import { useTheme } from "../hooks";
import { makeStyles } from '@material-ui/core';

interface SwitchProps {
    checked: boolean;
    name: string;
    disabled?: boolean;
    color: "default" | "primary" | "secondary" | undefined;
    onChange(event: ChangeEvent<HTMLInputElement>, checked: boolean) : void;
}

const Switch = ( props : SwitchProps) => {
    const { isLightTheme } = useTheme();

    const useStyles = makeStyles({
            rootStyle: {
                "& .Mui-checked": {
                    color: 'var(--c-primary-1-3)',
                },
                "& .MuiSwitch-track": {
                    background: isLightTheme ? '' : 'var(--c-white)',
                },
                "& .MuiSwitch-colorPrimary.Mui-disabled + .MuiSwitch-track": {
                    background: isLightTheme ? '' : 'var(--c-white)',
                }
            },
    });

    const { rootStyle } = useStyles();

    return <SwitchMaterialUi {...props} className={rootStyle}/>
};

Switch.defaultProps = {
    color: 'primary',
    disabled: false
}

export default Switch;