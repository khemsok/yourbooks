import { useState, useRef, useEffect } from "react";

// MUI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";

// util
import moment from "moment";
import { db } from "../src/firebase.config";

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{value === index && children}</Box>}
    </Typography>
  );
}

export function ReadMore({ description }) {
  const LENGTH = 400;
  const classes = makeStyles((theme) => ({
    booksDescription: {
      [theme.breakpoints.down("sm")]: {
        fontSize: ".65em",
      },
    },
  }))();

  const [isHidden, setIsHidden] = useState(true);
  return (
    <>
      {description && (
        <>
          <div
            className={classes.booksDescription}
            dangerouslySetInnerHTML={{
              __html: isHidden
                ? `${description.slice(0, LENGTH)}...`
                : description,
            }}
          />
          <span className={classes.booksDescription}>
            {description.length > LENGTH ? (
              <a
                style={{ cursor: "pointer", fontWeight: "700" }}
                onClick={() => setIsHidden(!isHidden)}
              >
                {isHidden ? "(More)" : "(Less)"}
              </a>
            ) : null}
          </span>
        </>
      )}
    </>
  );
}

export const displayDetails = (publishedDate, categories, rating) => {
  return [
    moment(publishedDate).format("YYYY"),
    categories && categories[0],
    rating ? `${rating}/5` : undefined,
  ]
    .filter((el) => el !== undefined)
    .join(" • ");
};

export const checkDocDetail = async (id, user = null) => {
  if (user) {
    const doc = await db
      .collection("books")
      .where("userId", "==", user.uid)
      .where("bookId", "==", id)
      .limit(1)
      .get();
    console.log("checkdocdetail");
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

export const checkDocsDetail = async (books, user = null) => {
  // TODO: Need to check if the two books are in the database. Then return back the data as it needed to be
  // pass in data.items
  const bookData = {};
  for (let book of books) {
    bookData[book.id] = {
      book: book,
      read: false,
      docId: null,
    };
  }

  if (user) {
    const bookIds = Object.keys(bookData);
    console.log("check docs detail: getting data from db ");
    const docs = await db
      .collection("books")
      .where("userId", "==", user.uid)
      .where("bookId", "in", bookIds)
      .get();

    docs.docs.map((doc) => {
      let bookId = doc.data()["bookId"];
      let docId = doc.id;
      if (bookIds.includes(bookId)) {
        bookData[bookId]["read"] = true;
        bookData[bookId]["docId"] = docId;
      }
    });
  }
  return Object.keys(bookData).map((bookId) => bookData[bookId]);
};

export const checkDocExists = async (id, user = null) => {
  if (user) {
    const doc = await db
      .collection("books")
      .where("bookId", "==", id)
      .where("userId", "==", user.uid)
      .limit(1)
      .get();
    console.log("checkdocexists");
    return !doc.empty;
  } else {
    return false;
  }
};

export const estReadingTime = (pages) => {
  const typicalPageLength = 300;
  const wordPerMinute = 300;

  const time = Math.ceil((pages * typicalPageLength) / wordPerMinute);
  const hours = Math.ceil(time / 60);
  const minutes = time % 60;

  return `Est. Reading Time ${hours ? hours + " hours" : ""} ${
    minutes ? minutes + " minutes" : ""
  }  `;
};

export const displayBookTitle = (title, subtitle) => {
  if (subtitle) {
    return `${title}: ${subtitle}`;
  } else {
    return title;
  }
};

export function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export const RemoveBookAlert = ({
  open,
  setOpen,
  book,
  setDiscoverBooks,
  docId,
  bookUserStatus,
  fetchBookUserStatus,
  componentType,
  fetchReadingList,
  fetchFinishedBooks,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const deleteFromDiscover = async () => {
    try {
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
      handleClose();
    } catch (e) {
      console.error(e);
      handleClose();
    }
  };

  const deleteFromBooks = async () => {
    try {
      await db.doc(`/books/${bookUserStatus.docId}`).delete();
      await fetchBookUserStatus();
      handleClose();
    } catch (e) {
      console.error(e);

      handleClose();
    }
  };

  const deleteFromReadingList = async () => {
    try {
      await db.doc(`/books/${docId}`).delete();
      await fetchReadingList();
      handleClose();
    } catch (e) {
      console.error(e);

      handleClose();
    }
  };

  const deleteFromFinishedBooks = async () => {
    try {
      await db.doc(`/books/${docId}`).delete();
      await fetchFinishedBooks();
      handleClose();
    } catch (e) {
      console.error(e);
      handleClose();
    }
  };

  const handleDelete = () => {
    if (componentType === "books") {
      deleteFromBooks();
    } else if (componentType === "readinglist") {
      deleteFromReadingList();
    } else if (componentType === "discover") {
      deleteFromDiscover();
    } else if (componentType === "finishedbooks") {
      deleteFromFinishedBooks();
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once delete, you cannot recover the saved data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export function CustomTooltip({ children, title }) {
  const classes = makeStyles({
    tooltip: {
      fontFamily: "Merriweather, serif",
      backgroundColor: "rgba(0, 0, 0, 0.90)",
      // backgroundColor: "transparent",
      // border: "1px solid black",
      // borderBottom: "1px solid black",
      // color: "black",
      borderRadius: 0,
      textAlign: "center",
    },
    arrow: {
      // color: "black",
    },
  })();
  return (
    <Tooltip
      classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
      title={title}
      placement="top"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 250 }}
    >
      {children}
    </Tooltip>
  );
}
