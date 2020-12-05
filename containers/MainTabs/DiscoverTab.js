import { useState, useEffect } from "react";

// Context
import { useAuth } from "../../context/AuthContext";

// MUI
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

// util
import moment from "moment";
import { Loading } from "react-loading-dot";

// const useStyles = makeStyles({
//   root: {
//     // "& .Mui-focused ": {
//     //   color: "black",
//     // },
//     // "& .MuiInput-underline:after": {
//     //   borderBottom: "2px solid black",
//     // },
//   },
// });

const useStyles = makeStyles((theme) => ({
  hidden: {
    display: "-webkit-box",
    WebkitLineClamp: 4,
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
  },
  discoverBooksThumbnailContainer: {
    minWidth: "170px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "120px",
    },
  },
  discoverBooksThumbnail: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: "90px",
    },
  },
  discoverBooksTitle: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1em",
    },
  },
  discoverBooksAuthor: {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8em",
      marginBottom: "5px",
    },
  },
  discoverBooksDetail: {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".6em",
      marginBottom: "5px",
    },
  },

  discoverBooksDescription: {
    [theme.breakpoints.down("sm")]: {
      fontSize: ".65em",
    },
  },
}));

function ReadMore({ children }) {
  const classes = useStyles();
  const [isHidden, setIsHidden] = useState(true);
  console.log(children.length > 400);
  return (
    <>
      <div>
        <div className={isHidden ? classes.hidden : null}>{children}</div>
        <span>
          {children.length > 400 ? (
            <a style={{ cursor: "pointer", fontWeight: "700" }} onClick={() => setIsHidden(!isHidden)}>
              {isHidden ? "(More)" : "(Less)"}
            </a>
          ) : null}
        </span>
      </div>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <>
          <Typography>{children}</Typography>
        </>
      )}
    </div>
  );
}

export default function DiscoverTab({ value, index }) {
  const classes = useStyles();

  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [discoverBooks, setDiscoverBooks] = useState([]);

  const fetchBooks = (value) => {
    if (value) {
      const url = "https://www.googleapis.com/books/v1/volumes?q=";
      setIsLoading(true);
      fetch(url + value)
        .then((res) => res.json())
        .then((data) => {
          if (data.items) {
            setBookList(data.items);
          } else {
            setBookList([]);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      setBookList([]);
    }
  };

  useEffect(() => {
    const url = "https://www.googleapis.com/books/v1/volumes?q=sapiens&maxResults=2";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDiscoverBooks(data.items);
      })
      .catch((err) => console.error(err));
  }, []);

  console.log(discoverBooks, "discover books");

  const displayDetails = (publishedDate, categories, rating) => {
    return [moment(publishedDate).format("YYYY"), categories.join(", "), rating ? `${rating}/5` : undefined].filter((el) => el !== undefined).join(" • ");
  };

  const displayDiscoverBooks = discoverBooks ? (
    discoverBooks.map((book, index) => (
      <div style={{ marginBottom: "30px" }} key={index}>
        <div style={{ display: "flex" }}>
          <div className={classes.discoverBooksThumbnailContainer}>
            <img className={classes.discoverBooksThumbnail} src={book.volumeInfo.imageLinks.thumbnail} />
          </div>

          <div>
            <Typography variant="h6" className={classes.discoverBooksTitle}>
              {book.volumeInfo.title}
            </Typography>
            <Typography variant="body1" className={classes.discoverBooksAuthor}>
              {book.volumeInfo.authors.join(", ")}
            </Typography>

            <Typography variant="body2" className={classes.discoverBooksDetail}>
              {displayDetails(book.volumeInfo.publishedDate, book.volumeInfo.categories, book.volumeInfo.averageRating)}
            </Typography>

            <Typography variant="body2" className={classes.discoverBooksDescription}>
              <ReadMore>{book.volumeInfo.description}</ReadMore>
            </Typography>
          </div>
        </div>
      </div>
    ))
  ) : (
    <>
      {/* <h1>loading</h1> */}
      <Loading background="#000" size="1rem" duration=".6s" />
    </>
  );

  return (
    <div>
      <TabPanel value={value} index={index}>
        <Container maxWidth="xs" style={{ marginBottom: "70px" }}>
          {/* <TextField label="Search books..." fullWidth color="primary" /> */}
          <Autocomplete
            color="primary"
            fullWidth
            filterOptions={(x) => x}
            freeSolo
            options={bookList}
            renderOption={(option) => {
              option = option.volumeInfo;
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
              return option.volumeInfo.title;
            }}
            disableClearable
            loading={isLoading}
            // onChange={handleSelected}
            onChange={(e, v) => {
              console.log(v, "onchange");
            }}
            renderInput={(params) => (
              <TextField
                // style={{ fontSize: "16px" }}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                label="Search books..."
                onChange={(e) => {
                  fetchBooks(e.target.value);
                }}
              />
            )}
          />
        </Container>
        <Container maxWidth="md">{displayDiscoverBooks}</Container>
      </TabPanel>
    </div>
  );
}
