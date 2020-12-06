import { useState } from "react";

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
import moment from "moment";
import { db } from "../../src/firebase.config";

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

function ReadMore({ children }) {
  const classes = useStyles();

  const [isHidden, setIsHidden] = useState(true);
  return (
    <>
      <div>
        <div className={isHidden ? classes.hidden : null}>{children}</div>
        <span>
          {children.length > 400 ? (
            <a style={{ cursor: "pointer", fontWeight: "700" }} onClick={() => setIsHidden(!isHidden)}>
              {isHidden ? "(More)" : "(Less)"}
            </a>
          ) : null}
        </span>
      </div>
    </>
  );
}

export default function DiscoverBooks() {
  const classes = useStyles();
  const { discoverBooks, setDiscoverBooks, checkDocDetail } = useDiscover();
  const { user } = useAuth();

  const displayDetails = (publishedDate, categories, rating) => {
    return [moment(publishedDate).format("YYYY"), categories && categories.join(", "), rating ? `${rating}/5` : undefined].filter((el) => el !== undefined).join(" • ");
  };

  const updateDiscoverBooks = async () => {
    let books = [];
    for (const book of discoverBooks) {
      let { read, docId } = await checkDocDetail(book.docId);
      books.push({
        book: book.book,
        read: !read,
        docId: docId,
      });
    }
    setDiscoverBooks(() => books);
  };

  console.log(discoverBooks, "from compo");

  const displayDiscoverBooks = discoverBooks ? (
    discoverBooks.map(({ book, read, docId }, index) => (
      <div style={{ marginBottom: "30px" }} key={index}>
        <div style={{ display: "flex" }}>
          <div className={classes.discoverBooksThumbnailContainer}>
            <img className={classes.discoverBooksThumbnail} src={book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail} />
          </div>

          <div>
            <Typography variant="h6" className={classes.discoverBooksTitle}>
              {book.volumeInfo.title}
            </Typography>
            <Typography variant="body1" className={classes.discoverBooksAuthor}>
              {book.volumeInfo.authors && book.volumeInfo.authors.join(", ")}
            </Typography>

            <Typography variant="body2" className={classes.discoverBooksDetail}>
              {displayDetails(book.volumeInfo.publishedDate, book.volumeInfo.categories, book.volumeInfo.averageRating)}
            </Typography>

            <Typography variant="body2" className={classes.discoverBooksDescription}>
              {book.volumeInfo.description ? <ReadMore>{book.volumeInfo.description}</ReadMore> : null}
            </Typography>
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
                  const docRef = await db.collection("books").add({
                    bookId: book.id,
                    data: book.volumeInfo,
                    start: new Date(),
                    end: "",
                    userId: user.uid,
                    rating: "",
                  }); // need document id
                  console.log(docRef.id, "book id");
                  // await updateDiscoverBooks(); // might not need to do a call to db, just need to update the state if the await does not have any error
                  setDiscoverBooks((books) =>
                    books.map((curBook) => {
                      if (curBook.book.id === book.id) {
                        return {
                          book: curBook.book,
                          read: true,
                          docId: docRef.id,
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
    <>
      {/* <h1>loading</h1> */}
      <Loading background="#000" size="1rem" duration=".6s" />
    </>
  );
  return <>{displayDiscoverBooks}</>;
}
