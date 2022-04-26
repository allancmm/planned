import { useContext } from "react";
import { DarkTheme, DesignThemeContext, LightTheme } from "equisoft-design-ui-elements";

const useTheme = () => {
    const { theme } = useContext(DesignThemeContext);

    const isLightTheme = theme === 'light';
    const currentTheme = isLightTheme ? LightTheme : DarkTheme;

    return { isLightTheme, currentTheme };
}

export default useTheme;
