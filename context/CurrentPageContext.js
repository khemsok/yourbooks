import { useState, useEffect, createContext, useContext } from "react";

// Context
import { useAuth } from "./AuthContext";
import { DiscoverProvider } from "./DiscoverContext";
import { ReadingListProvider, useReadingList } from "./ReadingListContext";
import { useFinishedBooks } from "./FinishedBooksContext";

// util
import { db } from "../src/firebase.config";

const CurrentPageContext = createContext(null);

export function useCurrentPage() {
  return useContext(CurrentPageContext);
}

export function CurrentPageProvider({ children }) {
  const { user } = useAuth();
  const { fetchReadingList } = useReadingList();
  const { fetchFinishedBooks } = useFinishedBooks();

  const [currentTab, setCurrentTab] = useState(null);

  const handleChangeTab = (event, newValue) => {
    if (user && newValue === 1) {
      // fetchDiscoverBooks();
    } else if (!user && newValue === 0) {
      // fetchDiscoverBooks();
    }
    if (user && newValue === 0) {
      fetchReadingList();
    }
    if (user && newValue == 2) {
      fetchFinishedBooks();
    }
    setCurrentTab(newValue);
  };

  useEffect(() => {
    console.log("wtf");
    if (user) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [user]);

  console.log(currentTab, "current tab");

  const value = { currentTab, handleChangeTab };
  return <CurrentPageContext.Provider value={value}>{children}</CurrentPageContext.Provider>;
}
