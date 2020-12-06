import { useState, useEffect } from "react";

// Context
import { useAuth } from "../../context/AuthContext";
import { DiscoverProvider } from "../../context/DiscoverContext";

// MUI
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

// Components
import DiscoverTab from "./DiscoverTab";

const StyledTabs = withStyles((theme) => ({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",

    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "black",
    },
  },
}))((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#000",
    fontFamily: "Merriweather, serif",
    fontWeight: "900",
    fontStyle: "italic",
    fontSize: "1.8em",
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1em",
    },
  },
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function MainTabs() {
  const [value, setValue] = useState(0);

  const { user } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log(user, "from tabs");
    if (user) {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [user]);

  console.log(value);

  return (
    <DiscoverProvider>
      {user ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <StyledTabs value={value} onChange={handleChange}>
              <StyledTab label="Reading List" />
              <StyledTab label="Discover" />

              <StyledTab label="Finished Books" />
            </StyledTabs>
          </div>
          <DiscoverTab value={value} index={1} />
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <StyledTabs value={value} onChange={handleChange}>
              <StyledTab label="Discover" />
            </StyledTabs>
          </div>
          <DiscoverTab value={value} index={0} />
        </>
      )}
    </DiscoverProvider>
  );
}
