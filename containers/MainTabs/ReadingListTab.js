import Link from "next/link";

// Context
import { useReadingList } from "../../context/ReadingListContext";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

// util
import { TabPanel } from "../../util/reusableComponents";

function DisplayBook(props) {}

export default function ReadingListTab({ value, index }) {
  const { readingList } = useReadingList();
  console.log(readingList, "wtf");
  return (
    <TabPanel value={value} index={index} style={{ marginTop: "50px" }}>
      <Container maxWidth="md">
        <Grid container spacing={5}>
          {readingList.map((book, index) => (
            <Grid item xs={12} md={4} key={index}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div style={{}}>
                  <img src={book.data.data.imageLinks.thumbnail} style={{ maxWidth: "100px" }} />
                </div>
                <div style={{ maxWidth: "200px" }}>
                  <Link href={`/books?id=${book.data.bookId}`}>
                    <Typography variant="h6" align="center" style={{ fontSize: ".8em", display: "-webkit-box", WebkitLineClamp: 2, overflow: "hidden", WebkitBoxOrient: "vertical" }}>
                      {book.data.data.title}
                      {book.data.data.subtitle && `: ${book.data.data.subtitle}`}
                    </Typography>
                  </Link>

                  <Typography variant="body1" align="center" style={{ fontSize: ".65em" }}>
                    {book.data.data.authors.join(", ")}
                  </Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </TabPanel>
  );
}
