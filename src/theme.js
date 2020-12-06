import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

const typographyObj = {
  button: {
    textTransform: "none",
  },
  fontFamily: "Libre Franklin, sans-serif, Merriweather, serif",
  h1: {
    fontFamily: "Merriweather, serif",
    fontWeight: "900",
    fontStyle: "italic",
  },
  h2: {
    fontFamily: "Libre Franklin, sans-serif",
    fontWeight: "300",
  },
  h3: {
    fontFamily: "Merriweather, serif",
    fontWeight: "900",
    fontStyle: "italic",
  },
  h4: {
    fontFamily: "Libre Franklin, sans-serif",
    fontWeight: "300",
  },
  h5: {
    fontFamily: "Libre Franklin, sans-serif",
    fontWeight: "300",
  },
  h6: {
    fontFamily: "Merriweather, serif",
    fontWeight: "700",
    fontStyle: "italic",
  },
  subtitle1: {
    fontFamily: "Libre Franklin, sans-serif",
    fontWeight: "500",
  },
  subtitle2: {
    fontFamily: "Libre Franklin, sans-serif",
    fontWeight: "500",
  },
  body1: {
    fontFamily: "Merriweather, serif",
  },
  body2: {
    fontFamily: "Merriweather, serif",
  },
};

// Create a theme instance.
export const dark = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#366CF2",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#161a2b",
    },
  },
  typography: typographyObj,
});

export const light = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: typographyObj,
});
