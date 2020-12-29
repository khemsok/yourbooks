import { useState, useEffect, createContext, useContext } from "react";

// Context
import { useAuth } from "./AuthContext";

// util
import { db } from "../src/firebase.config";

const FinishedBooksContext = createContext(null);

export function useFinishedBooks() {
  return useContext(FinishedBooksContext);
}

export function FinishedBooksProvider({ children }) {
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [finishedBooksPage, setFinishedBooksPage] = useState(1);

  const { user } = useAuth();

  const fetchFinishedBooks = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const snapshot = await db
          .collection("books")
          .where("userId", "==", user.uid)
          .where("completeStatus", "==", true)
          .orderBy("end", "desc")
          .get();
        console.log("fetchfinsihedbook");
        if (!snapshot.empty) {
          let data = [];
          snapshot.forEach((doc) => {
            data.push({ docId: doc.id, data: doc.data() });
          });
          setFinishedBooks(data);
          finishedBooksPage > Math.ceil(data.length / 6)
            ? setFinishedBooksPage((page) => page - 1)
            : null;
        } else {
          setFinishedBooks([]);
        }
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log("finishedbooks context effect");
    db.collection("books")
      .where("userId", "==", user.uid)
      .where("completeStatus", "==", true)
      .onSnapshot((snapshot) => {
        setIsLoading(true);
        let books = snapshot.docs.map((doc) => ({
          docId: doc.id,
          data: doc.data(),
        }));
        setFinishedBooks(books);
        finishedBooksPage > Math.ceil(books.length / 6)
          ? setFinishedBooksPage((page) => page - 1)
          : null;
      })
      .catch((err) => console.error(err));
  }, []);

  const value = {
    finishedBooks,
    fetchFinishedBooks,
    isLoading,
    setIsLoading,
    finishedBooksPage,
    setFinishedBooksPage,
  };
  return (
    <FinishedBooksContext.Provider value={value}>
      {children}
    </FinishedBooksContext.Provider>
  );
}
