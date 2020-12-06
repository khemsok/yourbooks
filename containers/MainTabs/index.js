import { useState, useEffect } from "react";

// Context
import { useAuth } from "../../context/AuthContext";
import { useDiscover } from "../../context/DiscoverContext";
import { useReadingList } from "../../context/ReadingListContext";

// MUI
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// Components
import DiscoverTab from "./DiscoverTab";
import ReadingListTab from "./ReadingListTab";

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

export default function MainTabs() {
  const [value, setValue] = useState(0);

  const { fetchDiscoverBooks } = useDiscover();
  const { fetchReadingList } = useReadingList();

  const { user } = useAuth();

  const handleChange = (event, newValue) => {
    if (user && newValue === 1) {
      fetchDiscoverBooks();
    } else if (!user && newValue === 0) {
      fetchDiscoverBooks();
    }
    if (user && newValue === 0) {
      fetchReadingList();
    }
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
    <>
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
          <ReadingListTab value={value} index={0} />
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
    </>
  );
}
