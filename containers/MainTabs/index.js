import { useState, useEffect } from "react";

// Context
import { useAuth } from "../../context/AuthContext";
import { useDiscover } from "../../context/DiscoverContext";
import { useReadingList } from "../../context/ReadingListContext";
import { useCurrentPage } from "../../context/CurrentPageContext";

// MUI
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// Components
import DiscoverTab from "./DiscoverTab";
import ReadingListTab from "./ReadingListTab";
import FinishedBooksTab from "./FinishedBooksTab";

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
  const { user } = useAuth();
  const { currentTab, handleChangeTab } = useCurrentPage();

  console.log(currentTab, "testing123");

  return (
    <>
      {user ? (
        currentTab !== null ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
              <StyledTabs value={currentTab} onChange={handleChangeTab}>
                <StyledTab label="Reading List" />
                <StyledTab label="Discover" />
                <StyledTab label="Finished Books" />
              </StyledTabs>
            </div>
            <DiscoverTab value={currentTab} index={1} />
            <ReadingListTab value={currentTab} index={0} />
            <FinishedBooksTab value={currentTab} index={2} />
          </>
        ) : null
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <StyledTabs value={0} onChange={handleChangeTab}>
              <StyledTab label="Discover" />
            </StyledTabs>
          </div>
          <DiscoverTab value={0} index={0} />
        </>
      )}
    </>
  );
}
