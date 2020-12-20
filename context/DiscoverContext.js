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
    if (user) {
      const snapshot = await db.collection("books").where("userId", "==", user.uid).limit(3).get();
      if (!snapshot.empty) {
        let data = [];
        snapshot.forEach((doc) => {
          let docData = doc.data();
          console.log(docData.data);
          if (docData.data.description) {
            data.push([docData.data.description.replace(/(<([^>]+)>)/gi, " "), docData.data.authors ? docData.data.authors.join(" ") : ""].join(" "));
          }
        });
        let bagOfWords = data.join(" ");
        let isbnList = ["123", "123", "4567"];
        let obj = {
          isbn_list: isbnList,
          bag_of_words: bagOfWords,
        };

        try {
          const res = await fetch(new URL("/api/recommender", document.baseURI), {
            method: "POST",
            body: JSON.stringify(obj),
          });
          const data = await res.json();
          console.log(data);
          let test = await Promise.all(
            data["data"].slice(0, 2).map(async (isbn) => {
              const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
              const data = await res.json();
              return data;
            })
          );
          console.log(test, "woooo");
          let list = [];
          for (const x of test) {
            list.push(x.items[0]);
          }
          console.log(list);
          let books = await checkDocsDetail(list, user);
          console.log(books, "testing 123");
          setDiscoverBooks(books);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
        }
      } else {
        // need to change recommender to send recommendation when there is no books
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
      }
    } else {
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
    }
  };

  // useEffect(() => {
  //   fetchDiscoverBooks();
  // }, [user]);

  const value = { discoverBooks, setDiscoverBooks, isLoading, fetchDiscoverBooks: fetchDiscoverBooks };

  return <DiscoverContext.Provider value={value}>{children}</DiscoverContext.Provider>;
}
