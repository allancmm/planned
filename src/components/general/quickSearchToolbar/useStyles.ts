import { createStyles, createTheme, makeStyles } from "@material-ui/core/styles";
import { useTheme } from "../hooks";

const defaultTheme = createTheme();

const useStyles = () => {
    const { isLightTheme } = useTheme();

    const makeStyle = makeStyles(
        (theme) =>
            createStyles({
                rootStyle: {
                    padding: theme.spacing(0.5, 0.5, 0),
                    justifyContent: 'space-between',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                },
                textFieldStyle: {
                    [theme.breakpoints.down('xs')]: {
                        width: '100%',
                    },
                    margin: theme.spacing(1, 0.5, 1.5),
                    '& .MuiSvgIcon-root': {
                        marginRight: theme.spacing(0.5),
                        color: isLightTheme ? 'unset' : 'var(--c-white)'
                    },
                    '& .MuiInput-underline:before': {
                        borderBottom: `1px solid ${isLightTheme ? "var(--c-midGrey)" : "var(--c-white)"}`,
                    },
                    '& .MuiInputBase-input': {
                        color: isLightTheme ? 'unset' : 'var(--c-white)'
                    }
                },
            }), { defaultTheme },
    );

    const { rootStyle, textFieldStyle } = makeStyle();
    return {
        rootStyle, textFieldStyle
    }
};

export default useStyles;