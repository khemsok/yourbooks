import { useState, useEffect, createContext, useContext } from "react";

// Context
import { useAuth } from "./AuthContext";

// util
import { db } from "../src/firebase.config";
import {
  checkDocDetail,
  checkDocsDetail,
  arrayEquals,
} from "../util/reusableComponents";

export const DiscoverContext = createContext(null);

export const useDiscover = () => {
  return useContext(DiscoverContext);
};

export function DiscoverProvider({ children }) {
  const { user } = useAuth();

  const [discoverBooks, setDiscoverBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]); // Used for caching
  const [isLoading, setIsLoading] = useState(true);

  // console.log(user, "testing wtf");

  const fetchDiscoverBooks = async () => {
    setIsLoading(true);
    if (user) {
      const snapshot = await db
        .collection("books")
        .where("userId", "==", user.uid)
        .limit(3)
        .get();
      if (!snapshot.empty) {
        let data = [];
        let userBookIds = [];
        let isbnList = [];
        snapshot.forEach((doc) => {
          let docData = doc.data();
          userBookIds.push(docData.bookId);
          console.log(docData, "testing docdata");
          if (docData.data.description) {
            data.push(
              [
                docData.data.description.replace(/(<([^>]+)>)/gi, " "),
                docData.data.authors ? docData.data.authors.join(" ") : "",
              ].join(" ")
            );
          }
          if (docData.data.industryIdentifiers) {
            let temp = docData.data.industryIdentifiers;
            let isbn;
            if (temp.length > 1) {
              isbn =
                temp[0]["type"] === "ISBN_10"
                  ? temp[0]["identifier"]
                  : temp[1]["identifier"];
              isbnList.push(isbn);
            } else {
              if (temp[0]["type"] === "ISBN_10") {
                isbnList.push(temp[0]["identifier"]);
              }
            }
          }
        });

        console.log(userBookIds, userBooks, discoverBooks, "testing discover");

        if (arrayEquals(userBooks, userBookIds)) {
          const bookArr = discoverBooks.map((book) => book.book);

          let books = await checkDocsDetail(bookArr, user);
          setDiscoverBooks(books);
          setIsLoading(false);
        } else {
          setUserBooks(userBookIds); // caching books to not call api multiple times
          let bagOfWords = data.join(" ");
          // let isbnList = ["123", "123", "4567"];
          // console.log(isbnList, "testing isbn list");
          let obj = {
            isbn_list: isbnList,
            bag_of_words: bagOfWords,
          };

          try {
            const res = await fetch(
              new URL("/api/recommender", document.baseURI),
              {
                method: "POST",
                body: JSON.stringify(obj),
              }
            );
            const data = await res.json();
            console.log(data);
            let test = await Promise.all(
              data["data"].slice(0, 2).map(async (isbn) => {
                const res = await fetch(
                  `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
                );
                const data = await res.json();
                return data;
              })
            );
            // console.log(test, "woooo");
            let list = [];
            for (const x of test) {
              list.push(x.items[0]);
            }
            // console.log(list);
            let books = await checkDocsDetail(list, user);
            // console.log(books, "testing 123");
            setDiscoverBooks(books);
            setIsLoading(false);
          } catch (err) {
            console.error(err);
            setIsLoading(false);
          }
        }
      } else {
        // TODO: need to change recommender to send recommendation when there is no books
        const url =
          "https://www.googleapis.com/books/v1/volumes?q=sapiens&maxResults=2";
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
      const url =
        "https://www.googleapis.com/books/v1/volumes?q=sapiens&maxResults=2";
      try {
        const res = await fetch(url);
        const data = await res.json();
        let books = await checkDocsDetail(data.items, user);
        setUserBooks([]);

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

  console.log(discoverBooks, "testng discover books");
  const value = {
    discoverBooks,
    setDiscoverBooks,
    isLoading,
    fetchDiscoverBooks: fetchDiscoverBooks,
  };

  return (
    <DiscoverContext.Provider value={value}>
      {children}
    </DiscoverContext.Provider>
  );
}
