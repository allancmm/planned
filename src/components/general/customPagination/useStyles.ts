import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => {
    return createStyles({
        disabled: {
            '& button': {
                pointerEvents: 'none',
                backgroundColor: 'transparent',
                // TODO - Allan - get the color directly from Equisoft Theme
                color: '#B7BBC2',
            },
        }
    })
});

export default useStyles;