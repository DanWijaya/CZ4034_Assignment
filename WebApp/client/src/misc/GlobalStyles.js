import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

export const globalStyles = responsiveFontSizes(
    createMuiTheme({
        palette: {
            primary: {
                main: "#394e2c",
                light: "#81c784",
                dark: "#388e3c",
                fade: fade("#2196f3", 0.15),
            }
        }
    })
)