import { useState, useEffect, createContext, useContext } from "react";

// Context
import { useAuth } from "./AuthContext";

// util
import { db } from "../src/firebase.config";
import { checkDocDetail, checkDocsDetail } from "../util/reusableComponents";

export const DiscoverContext = createContext(null);

export const useDiscover = () => {
  return useContext(DiscoverContext);
};

export function DiscoverProvider({ children }) {
  const { user } = useAuth();

  const [discoverBooks, setDiscoverBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDiscoverBooks = async () => {
    setIsLoading(true);
    const url = "https://www.googleapis.com/books/v1/volumes?q=sapiens&maxResults=2";
    try {
      const res = await fetch(url);
      const data = await res.json();
      let books = await checkDocsDetail(data.items, user);
      setDiscoverBooks(books);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchDiscoverBooks();
  // }, [user]);

  const value = { discoverBooks, setDiscoverBooks, isLoading, fetchDiscoverBooks: fetchDiscoverBooks };

  return <DiscoverContext.Provider value={value}>{children}</DiscoverContext.Provider>;
}
