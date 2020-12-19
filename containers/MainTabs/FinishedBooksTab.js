import { useEffect } from "react";
import Link from "next/link";

// Component
import FinishedBooksBook from "./FinishedBooksBook";

// Context
import { useAuth } from "../../context/AuthContext";
import { useFinishedBooks } from "../../context/FinishedBooksContext";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Rating from "@material-ui/lab/Rating";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

// MUI Icon
import RemoveIcon from "@material-ui/icons/Remove";

// util
import { TabPanel, checkDocDetail } from "../../util/reusableComponents";
import BarLoader from "react-spinners/BarLoader";

export default function FinishedBooksTab({ value, index }) {
  const { finishedBooks, isLoading, fetchFinishedBooks } = useFinishedBooks();

  useEffect(() => {
    fetchFinishedBooks();
  }, []);

  console.log(finishedBooks, "finishedbooks");
  return (
    <>
      <TabPanel value={value} index={index}>
        <Container maxWidth="md">
          {!isLoading ? (
            <Grid container spacing={4}>
              {finishedBooks.map((book, index) => (
                <FinishedBooksBook book={book} key={`${book.docId}-${index}`} />
              ))}
            </Grid>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <BarLoader color={"#000"} loading={isLoading} />
            </div>
          )}
        </Container>
      </TabPanel>
    </>
  );
}
