import { useState } from "react";
import Link from "next/link";

// MUI
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

// MUI Icon
import RemoveIcon from "@material-ui/icons/Remove";

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
}));

export default function ImageLoad({ book, setAlertDocId, setAlertOpen }) {
  const classes = useStyles();

  const [load, setLoad] = useState(false);
  return (
    <>
      <Grid item xs={12} md={4} style={{ minHeight: "220px" }}>
        {/* {!load ? (
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "40px" }}>
              <Skeleton variant="rect" height={50} width={100} />
            </div>
            <div style={{ display: "flex", width: "100%", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <Skeleton variant="rect" height={10} width="100%" style={{ marginBottom: "6px" }} />
                <Skeleton variant="rect" height={10} width="100%" />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Skeleton variant="rect" height={10} width={50} />
              </div>
            </div>
          </div>
        ) : null} */}
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{}}>
            <Link href={`/books?id=${book.data.bookId}`}>
              <img
                src={book.data.data.imageLinks ? book.data.data.imageLinks.thumbnail : "/no_cover.svg"}
                style={{ maxWidth: "100px", marginRight: "20px", cursor: "pointer" }}
                onLoad={() => {
                  setLoad(true);
                }}
              />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
            <div>
              <Link href={`/books?id=${book.data.bookId}`}>
                <Typography variant="h6" align="left" style={{ fontSize: ".8em", display: "-webkit-box", WebkitLineClamp: 2, overflow: "hidden", WebkitBoxOrient: "vertical", cursor: "pointer" }}>
                  {book.data.data.title}
                  {book.data.data.subtitle && `: ${book.data.data.subtitle}`}
                </Typography>
              </Link>

              <Typography variant="body1" align="left" style={{ fontSize: ".65em" }}>
                {book.data.data.authors.join(", ")}
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {/* <IconButton size="small">
                  <HighlightOffIcon fontSize="small" />
                </IconButton> */}
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
      </Grid>
    </>
  );
}
