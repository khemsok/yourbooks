import { useEffect, useState } from "react";
import Link from "next/link";

// Context
import { useReadingList } from "../../context/ReadingListContext";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

// MUI  Icon
import RemoveIcon from "@material-ui/icons/Remove";

// util
import { TabPanel, RemoveBookAlert } from "../../util/reusableComponents";
import BarLoader from "react-spinners/BarLoader";

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

export default function ReadingListTab({ value, index }) {
  const classes = useStyles();
  const { readingList, isLoading, fetchReadingList } = useReadingList();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDocId, setAlertDocId] = useState(null);

  useEffect(() => {
    fetchReadingList();
  }, []);

  console.log(readingList);

  return (
    <TabPanel value={value} index={index} style={{ marginTop: "50px" }}>
      <Container maxWidth="md">
        {!isLoading ? (
          <Grid container spacing={8}>
            {readingList.map((book, index) => (
              <Grid item xs={12} md={4} key={index}>
                <div style={{ display: "flex" }}>
                  <div style={{}}>
                    <Link href={`/books?id=${book.data.bookId}`}>
                      <img src={book.data.data.imageLinks ? book.data.data.imageLinks.thumbnail : "/no_cover.svg"} style={{ maxWidth: "100px", marginRight: "20px", cursor: "pointer" }} />
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
            ))}
            <RemoveBookAlert open={alertOpen} setOpen={setAlertOpen} fetchReadingList={fetchReadingList} componentType="readinglist" docId={alertDocId} />
          </Grid>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BarLoader color={"#000"} loading={isLoading} />
          </div>
        )}
      </Container>
    </TabPanel>
  );
}
