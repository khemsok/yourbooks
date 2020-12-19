import { useState, createContext, useContext } from "react";

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

  const { user } = useAuth();

  const fetchFinishedBooks = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const snapshot = await db.collection("books").where("userId", "==", user.uid).where("completeStatus", "==", true).get();
        console.log("fetchfinsihedbook");
        if (!snapshot.empty) {
          let data = [];
          snapshot.forEach((doc) => {
            data.push({ docId: doc.id, data: doc.data() });
          });
          setFinishedBooks(data);
        }
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    }
  };
  const value = { finishedBooks, fetchFinishedBooks, isLoading };
  return <FinishedBooksContext.Provider value={value}>{children}</FinishedBooksContext.Provider>;
}
