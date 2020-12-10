import React, { useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";

// Component
import Navbar from "../containers/Navbar";

// MUI
import Container from "@material-ui/core/Container";
import { createMuiTheme } from "@material-ui/core/styles";
import { light, dark } from "../src/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// Context
import CombinedContext from "../context/CombinedContext";
import { ThemeContext } from "../context/ThemeContext";

// util
import "../styles/globals.css";

const lightTheme = createMuiTheme(light);
const darkTheme = createMuiTheme(dark);

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const [theme, setTheme] = useState("light");

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    setTheme(localStorage.getItem("theme") || "light");
  }, []);

  React.useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <React.Fragment>
      <Head>
        <title>YourBooks</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <CombinedContext>
        <ThemeContext.Provider value={{ handleThemeChange, theme, setTheme }}>
          <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Container maxWidth="xl">
              <Navbar />
            </Container>
            <Component {...pageProps} />
          </ThemeProvider>
        </ThemeContext.Provider>
      </CombinedContext>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
