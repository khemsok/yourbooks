import { useState, useEffect, createContext, useContext } from "react";

// Context
import { useAuth } from "./AuthContext";

// util
import { db } from "../src/firebase.config";

export const DiscoverContext = createContext(null);

export const useDiscover = () => {
  return useContext(DiscoverContext);
};

export function DiscoverProvider({ children }) {
  const { user } = useAuth();

  const [discoverBooks, setDiscoverBooks] = useState([]);

  const checkDocDetail = async (id) => {
    if (user) {
      const doc = await db.collection("books").where("bookId", "==", id).where("userId", "==", user.uid).limit(1).get();
      const docId = !doc.empty ? doc.docs[0].id : "";
      const docDetail = {
        read: doc.empty,
        docId: docId,
      };
      return docDetail;
    } else {
      return {
        read: null,
        docId: null,
      };
    }
  };

  const fetchDiscoverBooks = async () => {
    const url = "https://www.googleapis.com/books/v1/volumes?q=sapiens&maxResults=2";
    try {
      console.log("hello?????");
      const res = await fetch(url);
      const data = await res.json();
      let books = [];
      for (const book of data.items) {
        let { read, docId } = await checkDocDetail(book.id);
        console.log(read, docId, book.volumeInfo.title, "check doc empty fetch inside of provider");
        books.push({
          book: book,
          read: !read,
          docId: docId,
        });
      }
      console.log(books);
      setDiscoverBooks(books);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiscoverBooks();
  }, [user]);

  const value = { discoverBooks, setDiscoverBooks, checkDocDetail, fetchDiscoverBooks: fetchDiscoverBooks };

  return <DiscoverContext.Provider value={value}>{children}</DiscoverContext.Provider>;
}
