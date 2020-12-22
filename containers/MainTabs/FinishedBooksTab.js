import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Component
import FinishedBooksBook from "./FinishedBooksBook";

// Context
import { useAuth } from "../../context/AuthContext";
import { useFinishedBooks } from "../../context/FinishedBooksContext";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Pagination from "@material-ui/lab/Pagination";

// util
import { TabPanel, RemoveBookAlert, paginate } from "../../util/reusableComponents";
import BarLoader from "react-spinners/BarLoader";
import { isMobile } from "react-device-detect";

export default function FinishedBooksTab({ value, index }) {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDocId, setAlertDocId] = useState(null);

  const { finishedBooks, isLoading, setIsLoading, fetchFinishedBooks, finishedBooksPage, setFinishedBooksPage } = useFinishedBooks();

  // useEffect(() => {
  //   fetchFinishedBooks();
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
  }, [finishedBooks]);

  console.log(finishedBooks, "finishedbooks");
  console.log(finishedBooksPage, "pagegggg");
  return (
    <>
      <TabPanel value={value} index={index}>
        {!isLoading ? (
          finishedBooks.length === 0 ? (
            <Typography variant="h6">You haven't finished any books :(</Typography>
          ) : (
            <>
              <Container maxWidth="xs">
                <Autocomplete
                  color="primary"
                  fullWidth
                  freeSolo
                  options={finishedBooks}
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
                      label="Search your finished books..."
                    />
                  )}
                />
              </Container>
              <Container maxWidth="md" style={{ minHeight: "55vh", position: "relative", marginTop: "70px" }}>
                <Grid container spacing={4}>
                  {((!isMobile && finishedBooks.length > 6 && paginate(finishedBooks, 6, finishedBooksPage)) || finishedBooks).map((book, index) => (
                    <FinishedBooksBook book={book} key={`${book.docId}-${index}`} setAlertDocId={setAlertDocId} setAlertOpen={setAlertOpen} />
                  ))}
                </Grid>
                <RemoveBookAlert open={alertOpen} setOpen={setAlertOpen} fetchFinishedBooks={fetchFinishedBooks} componentType="finishedbooks" docId={alertDocId} />
                {!isLoading && finishedBooks && finishedBooks.length > 6 && !isMobile ? (
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "auto", position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)" }}>
                    <Pagination
                      count={Math.ceil(finishedBooks.length / 6)}
                      onChange={(e, value) => {
                        setFinishedBooksPage(value);
                      }}
                      page={finishedBooksPage}
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
    </>
  );
}
