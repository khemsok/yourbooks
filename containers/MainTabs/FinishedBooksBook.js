import { useState } from "react";
import Link from "next/link";

// MUI
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

// MUI Icon
import RemoveIcon from "@material-ui/icons/Remove";

// util
import { db } from "../../src/firebase.config";

export default function FinishedBooksBook({ book, key }) {
  const [rating, setRating] = useState(book.data.rating || 0);

  return (
    <Grid item xs={12} md={4} style={{ minHeight: "220px" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div>
          <Link href={`/books?id=${book.data.bookId}`}>
            <img
              src={book.data.data.imageLinks ? book.data.data.imageLinks.thumbnail : "/no_cover.svg"}
              style={{ maxWidth: "150px", marginRight: "20px", cursor: "pointer" }}
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
                <Typography variant="h6" align="left" style={{ fontSize: ".95em", display: "-webkit-box", WebkitLineClamp: 2, overflow: "hidden", WebkitBoxOrient: "vertical", cursor: "pointer" }}>
                  {book.data.data.title}
                  {book.data.data.subtitle && `: ${book.data.data.subtitle}`}
                </Typography>
              </Link>

              <Typography variant="body1" align="left" style={{ fontSize: ".8em" }}>
                {book.data.data.authors.join(", ")}
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
                    // setAlertDocId(book.docId);
                    // setAlertOpen(true);
                  }}
                >
                  <RemoveIcon />
                  <Typography variant="body2">Remove</Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
}
