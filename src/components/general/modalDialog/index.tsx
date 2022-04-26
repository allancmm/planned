import React  from "react";
import { ModalDialog as ModalDialogDesign, Modal as ModalDesign } from '@equisoft/design-elements-react'
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useTheme } from "../../general/hooks";

const ModalDialog = ({ children = <></>, confirmPanel = true, shouldCloseOnOverlayClick = false, ...props}) => {
    const { currentTheme } = useTheme();

    const useStyles = makeStyles(() =>
        createStyles({
            modal: {
                maxWidth: 1000,
                background: currentTheme?.colors.background.main,
                '& header': {
                    color: currentTheme.colors.text.primary
                },
                '& main': {
                    overflowY: 'unset',
                    color: currentTheme.colors.text.primary
                }
            }
        }),
    );

    const classes = useStyles();

    return (
        confirmPanel ?
            <ModalDialogDesign
                appElement="#root"
                className={classes.modal}
                shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
                {...props}
            >
                { children }
             </ModalDialogDesign>
         : <ModalDesign
                appElement="#root"
                className={classes.modal}
                shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
                {...props}
            >
                { children }
           </ModalDesign>
    );
}

export default ModalDialog;