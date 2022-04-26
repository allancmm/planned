import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => {
    return createStyles({
        customCardStyles: {
            padding: 'var(--spacing-1x) var(--spacing-2x) 0 var(--spacing-2x)',
            marginBottom: 'var(--spacing-2x)',
        }
    })
});

export default useStyles;