import { useState } from "react";
import Link from "next/link";

// MUI
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

// MUI Icon
import RemoveIcon from "@material-ui/icons/Remove";

// util
import { db } from "../../src/firebase.config";
import { CustomTooltip, displayBookTitle } from "../../util/reusableComponents";

const useStyles = makeStyles((theme) => ({
  readingList: {
    fontSize: ".65em",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".6em",
    },
  },
  readingIcon: {
    fontSize: ".8em",
    marginRight: "3px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".75em",
    },
  },
  bookTitle: {
    // opacity: ".9",
    fontSize: ".8em",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    cursor: "pointer",
    // transition: "opacity .2s ease-in-out",
    "&:hover": {
      // opacity: "1",
    },
  },
  bookAuthor: {
    fontSize: ".65em",
  },
}));

export default function FinishedBooksBook({ book, setAlertDocId, setAlertOpen }) {
  const classes = useStyles();
  const [rating, setRating] = useState(book.data.rating || 0);

  return (
    <Grid item xs={12} md={4} style={{ minHeight: "220px" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div>
          <Link href={`/books?id=${book.data.bookId}`}>
            <img
              src={book.data.data.imageLinks ? book.data.data.imageLinks.thumbnail : "/no_cover.svg"}
              style={{ maxWidth: "120px", marginRight: "20px", cursor: "pointer" }}
              // onLoad={() => {
              //   setLoad(true);
              // }}
            />
          </Link>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            <div>
              <Link href={`/books?id=${book.data.bookId}`}>
                <div>
                  <CustomTooltip title={displayBookTitle(book.data.data.title, book.data.data.subtitle)}>
                    <Typography variant="h6" align="left" className={classes.bookTitle}>
                      {displayBookTitle(book.data.data.title, book.data.data.subtitle)}
                    </Typography>
                  </CustomTooltip>
                </div>
              </Link>

              <Typography variant="body1" align="left" className={classes.bookAuthor}>
                {book.data.data.authors && book.data.data.authors.join(", ")}
              </Typography>

              <div>
                <Rating
                  value={rating}
                  size="small"
                  style={{ marginBottom: "10px" }}
                  onChange={async (e, value) => {
                    setRating(value);
                    await db.doc(`/books/${book.docId}`).update({ rating: value });
                  }}
                  name={`rating-${book.docId}`}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div>
                <Button
                  onClick={() => {
                    setAlertDocId(book.docId);
                    setAlertOpen(true);
                  }}
                >
                  <RemoveIcon className={classes.readingIcon} />
                  <Typography variant="body2" className={classes.readingList}>
                    Remove
                  </Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
}
