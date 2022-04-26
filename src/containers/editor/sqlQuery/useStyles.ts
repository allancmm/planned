import {createStyles, createTheme, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => createStyles({
    container: {
       marginBottom: 'var(--spacing-1x)',
       height: 'fit-content'
   },
    bodyContainer: {
        height: '100%'
    },
    buttonContainer: {
        height: 'fit-content',
        marginTop: 'var(--spacing-1x)'
    },
    xmlContainer: {
        maxHeight: '40vh',
        overflow: 'auto',
    },
    dataGrid: {
        marginTop: 'var(--spacing-1x)'
    }
}));

export default useStyles;

export const customTheme = createTheme({
    typography: {
        fontSize: 12,
    },
});