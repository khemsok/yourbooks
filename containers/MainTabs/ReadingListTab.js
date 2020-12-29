import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Context
import { useReadingList } from "../../context/ReadingListContext";
import { useAuth } from "../../context/AuthContext";

// Component
import ReadingListBook from "./ReadingListBook";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// util
import {
  TabPanel,
  RemoveBookAlert,
  paginate,
} from "../../util/reusableComponents";
import BarLoader from "react-spinners/BarLoader";
import { isMobile } from "react-device-detect";
import { db } from "../../src/firebase.config";

export default function ReadingListTab({ value, index }) {
  const router = useRouter();
  const {
    readingList,
    setReadingList,
    isLoading,
    fetchReadingList,
    setIsLoading,
    readingPage,
    setReadingPage,
  } = useReadingList();

  const { user } = useAuth();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDocId, setAlertDocId] = useState(null);
  // const [page, setPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
  }, [readingList]);

  return (
    <TabPanel value={value} index={index}>
      {!isLoading ? (
        readingList.length === 0 ? (
          <Typography variant="h6">
            You don't have any book in your reading list :(
          </Typography>
        ) : (
          <>
            <Container maxWidth="xs">
              <Autocomplete
                color="primary"
                fullWidth
                freeSolo
                options={readingList}
                renderOption={(option) => {
                  option = option.data.data;
                  return (
                    <>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ minWidth: "70px" }}>
                          <img
                            src={
                              option.imageLinks &&
                              option.imageLinks.smallThumbnail
                            }
                            style={{ maxHeight: "50px" }}
                          />
                        </div>
                        <Typography
                          variant="body2"
                          style={{ fontSize: ".8em" }}
                        >
                          {option.title}
                          {option.subtitle ? `: ${option.subtitle}` : null}
                        </Typography>
                      </div>
                    </>
                  );
                }}
                getOptionLabel={(option) => {
                  return `${option.data.data.title}`;
                }}
                loading={isLoading}
                onChange={(e, v, r) => {
                  if (r === "select-option") {
                    router.push(`/books?id=${v.data.bookId}`);
                  }
                }}
                onInputChange={(e, v, r) => {
                  if (r === "clear") {
                    // setBookList([]);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                    }}
                    label="Search your reading list..."
                  />
                )}
              />
            </Container>
            <Container
              maxWidth="md"
              style={{
                minHeight: "55vh",
                position: "relative",
                marginTop: "70px",
              }}
            >
              <Grid container spacing={4}>
                {(
                  (!isMobile &&
                    readingList.length > 6 &&
                    paginate(readingList, 6, readingPage)) ||
                  readingList
                ).map((book, index) => (
                  <ReadingListBook
                    book={book}
                    setAlertDocId={setAlertDocId}
                    setAlertOpen={setAlertOpen}
                    key={`${index}-${book.data.bookId}`}
                  />
                ))}
              </Grid>
              <RemoveBookAlert
                open={alertOpen}
                setOpen={setAlertOpen}
                fetchReadingList={fetchReadingList}
                componentType="readinglist"
                docId={alertDocId}
              />
              {!isLoading &&
              readingList &&
              readingList.length > 6 &&
              !isMobile ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "auto",
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <Pagination
                    count={Math.ceil(readingList.length / 6)}
                    onChange={(e, value) => {
                      setReadingPage(value);
                    }}
                    page={readingPage}
                  />
                </div>
              ) : null}
            </Container>
          </>
        )
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BarLoader color={"#000"} loading={isLoading} />
        </div>
      )}
    </TabPanel>
  );
}
