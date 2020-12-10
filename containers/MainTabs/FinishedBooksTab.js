// Context
import { useAuth } from "../../context/AuthContext";
import { useFinishedBooks } from "../../context/FinishedBooksContext";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

// util
import { TabPanel, checkDocDetail } from "../../util/reusableComponents";

export default function FinishedBooksTab({ value, index }) {
  const { finishedBooks } = useFinishedBooks();

  console.log(finishedBooks, "finishedbooks");
  return (
    <>
      <TabPanel value={value} index={index}>
        <Container maxWidth="md">
          {finishedBooks.map((book, index) => (
            <Typography variant="h6">{book.data.data.title}</Typography>
          ))}
        </Container>
      </TabPanel>
    </>
  );
}
