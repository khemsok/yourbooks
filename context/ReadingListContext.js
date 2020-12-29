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
  const [readingPage, setReadingPage] = useState(1);

  const { user } = useAuth();

  const fetchReadingList = async () => {
    if (user) {
      setIsLoading(true);
      const snapshot = await db
        .collection("books")
        .where("userId", "==", user.uid)
        .where("completeStatus", "==", false)
        .get();
      if (!snapshot.empty) {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ docId: doc.id, data: doc.data() });
        });
        setReadingList(data);
        readingPage > Math.ceil(data.length / 6)
          ? setReadingPage((page) => page - 1)
          : null;
      } else {
        setReadingList([]);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchReadingList();
    // console.log("readinglist context effect");
    // const unsubscribe = db
    //   .collection("books")
    //   .where("userId", "==", user.uid)
    //   .where("completeStatus", "==", false)
    //   .onSnapshot((snapshot) => {
    //     setIsLoading(true);
    //     let books = snapshot.docs.map((doc) => ({
    //       docId: doc.id,
    //       data: doc.data(),
    //     }));
    //     setReadingList(books);
    //     console.log(books, books.length, "books reading list");
    //     // console.log(readingPage, "testing testing readingpage");
    //     readingPage > Math.ceil(books.length / 6)
    //       ? setReadingPage((page) => page - 1)
    //       : null;
    //   });
    // return unsubscribe;
  }, []);

  const value = {
    readingList,
    setIsLoading,
    setReadingList,
    fetchReadingList,
    isLoading,
    readingPage,
    setReadingPage,
  };
  return (
    <ReadingListContext.Provider value={value}>
      {children}
    </ReadingListContext.Provider>
  );
}
