import { useState, useEffect, createContext, useContext } from "react";

// Context
import { useAuth } from "./AuthContext";

// util
import { db } from "../src/firebase.config";

export const ReadingListContext = createContext(null);

export function useReadingList() {
  return useContext(ReadingListContext);
}

export function ReadingListProvider({ children }) {
  const [readingList, setReadingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { user } = useAuth();

  const fetchReadingList = async () => {
    if (user) {
      setIsLoading(true);
      const snapshot = await db.collection("books").where("userId", "==", user.uid).where("completeStatus", "==", false).get();
      console.log("fetchreadinglist inside context");
      if (!snapshot.empty) {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ docId: doc.id, data: doc.data() });
        });
        setReadingList(data);
      } else {
        setReadingList([]);
      }

      setIsLoading(false);
    }
  };

  const value = { readingList, setReadingList, fetchReadingList, isLoading, page, setPage };
  return <ReadingListContext.Provider value={value}>{children}</ReadingListContext.Provider>;
}
