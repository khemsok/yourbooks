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
  const { user } = useAuth();

  const fetchFinishedBooks = async () => {
    if (user) {
      const snapshot = await db.collection("books").where("userId", "==", user.uid).where("completeStatus", "==", true).get();
      if (!snapshot.empty) {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ docId: doc.id, data: doc.data() });
        });
        setFinishedBooks(data);
      }
    }
  };
  const value = { finishedBooks, fetchFinishedBooks };
  return <FinishedBooksContext.Provider value={value}>{children}</FinishedBooksContext.Provider>;
}
