import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => createStyles({
    containerButtons: {
        height: 'fit-content',
        marginBottom: 'var(--spacing-1x)'
    },
    title: {
        margin: 'var(--spacing-2x) 0'
    }
}));

export default useStyles;