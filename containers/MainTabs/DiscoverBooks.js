import { useState } from "react";
import Link from "next/link";

// Context
import { useAuth } from "../../context/AuthContext";
import { useDiscover } from "../../context/DiscoverContext";

// MUI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

// MUI Icons
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

// util
import { Loading } from "react-loading-dot";
import BarLoader from "react-spinners/BarLoader";
import moment from "moment";
import { db } from "../../src/firebase.config";
import { ReadMore, displayDetails } from "../../util/reusableComponents";

const useStyles = makeStyles((theme) => ({
  hidden: {
    display: "-webkit-box",
    WebkitLineClamp: 4,
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
  },
  discoverBooksThumbnailContainer: {
    minWidth: "170px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "120px",
    },
  },
  discoverBooksThumbnail: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: "90px",
    },
  },
  discoverBooksTitle: {
    cursor: "pointer",
    display: "inline-block",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1em",
    },
  },
  discoverBooksAuthor: {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8em",
      marginBottom: "5px",
    },
  },
  discoverBooksDetail: {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".6em",
      marginBottom: "5px",
    },
  },

  discoverBooksDescription: {
    [theme.breakpoints.down("sm")]: {
      fontSize: ".65em",
    },
  },

  readingList: {
    fontSize: ".8em",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".65em",
    },
  },
  readingIcon: {
    fontSize: "1em",
    marginRight: "3px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8em",
    },
  },
}));

export default function DiscoverBooks() {
  const classes = useStyles();
  const { discoverBooks, setDiscoverBooks, isLoading, checkDocDetail } = useDiscover();
  const { user } = useAuth();

  const displayDiscoverBooks = !isLoading ? (
    discoverBooks.map(({ book, read, docId }, index) => (
      <div style={{ marginBottom: "30px" }} key={index}>
        <div style={{ display: "flex" }}>
          <div className={classes.discoverBooksThumbnailContainer}>
            <img className={classes.discoverBooksThumbnail} src={book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail} />
          </div>

          <div>
            <Link href={`/books?id=${book.id}`}>
              <Typography variant="h6" className={classes.discoverBooksTitle}>
                {book.volumeInfo.title}
                {book.volumeInfo.subtitle && `: ${book.volumeInfo.subtitle}`}
              </Typography>
            </Link>
            <Typography variant="body1" className={classes.discoverBooksAuthor}>
              {book.volumeInfo.authors && book.volumeInfo.authors.join(", ")}
            </Typography>

            <Typography variant="body2" className={classes.discoverBooksDetail}>
              {displayDetails(book.volumeInfo.publishedDate, book.volumeInfo.categories, book.volumeInfo.averageRating)}
            </Typography>

            <div className={classes.discoverBooksDescription}>{book.volumeInfo.description ? <ReadMore>{book.volumeInfo.description}</ReadMore> : null}</div>
          </div>
        </div>
        {user ? (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {read ? (
              <Button
                onClick={async () => {
                  console.log(book.docId);
                  await db.doc(`/books/${docId}`).delete();
                  setDiscoverBooks((books) =>
                    books.map((curBook) => {
                      if (curBook.book.id === book.id) {
                        return {
                          book: curBook.book,
                          read: false,
                          docId: "",
                        };
                      } else {
                        return curBook;
                      }
                    })
                  );
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RemoveIcon className={classes.readingIcon} />
                  <Typography variant="body2" className={classes.readingList}>
                    Remove from Reading List
                  </Typography>
                </div>
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  const doc = await db.collection("books").where("bookId", "==", book.id).where("userId", "==", user.uid).limit(1).get();
                  let docRef;
                  if (doc.empty) {
                    docRef = await db.collection("books").add({
                      bookId: book.id,
                      data: book.volumeInfo,
                      start: moment().format("YYYY-MM-DD"),
                      end: "",
                      userId: user.uid,
                      rating: "",
                      completeStatus: false,
                      notes: "",
                    });
                  }

                  setDiscoverBooks((books) =>
                    books.map((curBook) => {
                      if (curBook.book.id === book.id) {
                        return {
                          book: curBook.book,
                          read: true,
                          docId: doc.empty ? docRef.id : doc.docs[0].id,
                        };
                      } else {
                        return curBook;
                      }
                    })
                  );
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <AddIcon className={classes.readingIcon} />
                  <Typography variant="body2" className={classes.readingList}>
                    Add to Reading List
                  </Typography>
                </div>
              </Button>
            )}
          </div>
        ) : null}
      </div>
    ))
  ) : (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <BarLoader color={"#000"} loading={isLoading} />
    </div>
  );
  return <>{displayDiscoverBooks}</>;
}
