import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Context
import { useReadingList } from "../../context/ReadingListContext";

// Component
import ReadingListBook from "./ReadingListBook";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// MUI  Icon
import RemoveIcon from "@material-ui/icons/Remove";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

// util
import { TabPanel, RemoveBookAlert, paginate } from "../../util/reusableComponents";
import BarLoader from "react-spinners/BarLoader";
import { isMobile } from "react-device-detect";

export default function ReadingListTab({ value, index }) {
  const router = useRouter();
  const { readingList, isLoading, fetchReadingList, page, setPage } = useReadingList();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDocId, setAlertDocId] = useState(null);
  // const [page, setPage] = useState(1);

  useEffect(() => {
    fetchReadingList();
  }, []);

  console.log(readingList);

  return (
    <TabPanel value={value} index={index}>
      {!isLoading ? (
        readingList.length === 0 ? (
          <Typography variant="h6">You don't have any book in your reading list</Typography>
        ) : (
          <>
            {readingList.length > 6 ? (
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
                            <img src={option.imageLinks && option.imageLinks.smallThumbnail} style={{ maxHeight: "50px" }} />
                          </div>
                          <Typography variant="body2" style={{ fontSize: ".8em" }}>
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
                      // console.log(v, "teseting");
                      router.push(`/books?id=${v.data.bookId}`);
                    }
                    // console.log(r);
                    // if (r === "clear") {
                    //   setBookList([]);
                    //   // fetchDiscoverBooks();
                    // } else if (r === "select-option") {
                    //   let { read, docId } = await checkDocDetail(v.id, user);
                    //   setDiscoverBooks([{ book: v, read: !read, docId: docId }]);
                    //   setBookList([]);
                    // }
                  }}
                  onInputChange={(e, v, r) => {
                    if (r === "clear") {
                      // setBookList([]);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      // style={{ fontSize: "16px" }}
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      label="Search your reading list..."
                      // onChange={(e) => {
                      //   // fetchBooks(e.target.value);
                      // }}
                    />
                  )}
                />
              </Container>
            ) : null}
            <Container maxWidth="md" style={{ minHeight: "55vh", position: "relative", marginTop: "70px" }}>
              <Grid container spacing={8}>
                {/* <Grid item xs={12}>
              <Typography variant="body2">You have 10 books on your Reading List</Typography>
            </Grid> */}
                {((!isMobile && paginate(readingList, 6, page)) || readingList).map((book, index) => (
                  <ReadingListBook book={book} setAlertDocId={setAlertDocId} setAlertOpen={setAlertOpen} key={`${index}-${book.data.bookId}`} />
                ))}
                <RemoveBookAlert open={alertOpen} setOpen={setAlertOpen} fetchReadingList={fetchReadingList} componentType="readinglist" docId={alertDocId} />
              </Grid>
              {!isLoading && readingList && readingList.length > 6 && !isMobile ? (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "auto", position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)" }}>
                  <Pagination
                    count={Math.ceil(readingList.length / 6)}
                    onChange={(e, value) => {
                      setPage(value);
                    }}
                    page={page}
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
