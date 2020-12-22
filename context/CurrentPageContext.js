import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";

// Context
import { useAuth } from "./AuthContext";
import { DiscoverProvider, useDiscover } from "./DiscoverContext";
import { ReadingListProvider, useReadingList } from "./ReadingListContext";
import { useFinishedBooks } from "./FinishedBooksContext";

// util
import { db } from "../src/firebase.config";

const CurrentPageContext = createContext(null);

export function useCurrentPage() {
  return useContext(CurrentPageContext);
}

export function CurrentPageProvider({ children }) {
  const router = useRouter();

  const { user } = useAuth();
  const { fetchReadingList } = useReadingList();
  const { fetchFinishedBooks } = useFinishedBooks();
  const { fetchDiscoverBooks } = useDiscover();

  const [currentTab, setCurrentTab] = useState(null);

  const handleChangeTab = (event, newValue) => {
    if (user && newValue === 1) {
      fetchDiscoverBooks();
    } else if (!user && newValue === 0) {
      fetchDiscoverBooks();
    }
    if (user && newValue === 0) {
      // fetchReadingList();
    }
    if (user && newValue == 2) {
      // fetchFinishedBooks();
    }
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (user) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [user]);

  // useEffect(() => {
  //   if ((router.pathname !== "/books" && user && currentTab === null) || currentTab === 1) {
  //     console.log("my router pathname is ", router.pathname);
  //     fetchDiscoverBooks();
  //   }
  // }, [router.pathname]);

  console.log(currentTab, "current tab");

  const value = { currentTab, handleChangeTab };
  return <CurrentPageContext.Provider value={value}>{children}</CurrentPageContext.Provider>;
}
