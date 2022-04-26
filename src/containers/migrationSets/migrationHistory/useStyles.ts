import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => createStyles({
    migrationSet: {
        padding: 'var(--spacing-2x)'
    },
    tabContainer: {
        height: 'fit-content'
    },
    filterContainer: {
        display: 'flex',
        margin: '0 var(--spacing-1x)'
    }
}));

export default useStyles;