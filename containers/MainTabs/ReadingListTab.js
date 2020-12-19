import { useEffect, useState } from "react";
import Link from "next/link";

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

// MUI  Icon
import RemoveIcon from "@material-ui/icons/Remove";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

// util
import { TabPanel, RemoveBookAlert, paginate } from "../../util/reusableComponents";
import BarLoader from "react-spinners/BarLoader";
import { isMobile } from "react-device-detect";

export default function ReadingListTab({ value, index }) {
  const { readingList, isLoading, fetchReadingList, page, setPage } = useReadingList();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDocId, setAlertDocId] = useState(null);
  // const [page, setPage] = useState(1);

  // useEffect(() => {
  //   console.log("is this it?");
  //   fetchReadingList();
  // }, []);

  // console.log(readingList);

  return (
    <TabPanel value={value} index={index} style={{ marginTop: "50px" }}>
      <Container maxWidth="md" style={{ minHeight: "50vh", position: "relative" }}>
        {!isLoading ? (
          readingList.length === 0 ? (
            <Typography variant="h6">You don't have any book in your reading list</Typography>
          ) : (
            <Grid container spacing={8}>
              {/* <Grid item xs={12}>
              <Typography variant="body2">You have 10 books on your Reading List</Typography>
            </Grid> */}
              {((!isMobile && paginate(readingList, 6, page)) || readingList).map((book, index) => (
                <ReadingListBook book={book} setAlertDocId={setAlertDocId} setAlertOpen={setAlertOpen} key={`${index}-${book.data.bookId}`} />
              ))}
              <RemoveBookAlert open={alertOpen} setOpen={setAlertOpen} fetchReadingList={fetchReadingList} componentType="readinglist" docId={alertDocId} />
            </Grid>
          )
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BarLoader color={"#000"} loading={isLoading} />
          </div>
        )}
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
    </TabPanel>
  );
}
