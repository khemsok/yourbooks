import { useState } from "react";

// Component
import DiscoverBooks from "./DiscoverBooks";

// Context
import { useDiscover } from "../../context/DiscoverContext";
import { useAuth } from "../../context/AuthContext";

// MUI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

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

  const { user } = useAuth();
  const { discoverBooks, setDiscoverBooks, checkDocDetail, fetchDiscoverBooks } = useDiscover();

  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <>
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
              return option.volumeInfo && option.volumeInfo.title;
            }}
            loading={isLoading}
            onChange={async (e, v, r) => {
              console.log(r);
              if (r === "clear") {
                setBookList([]);
                fetchDiscoverBooks();
              } else if (r === "select-option") {
                let { read, docId } = await checkDocDetail(v.id);
                setDiscoverBooks([{ book: v, read: !read, docId: docId }]);
              }
            }}
            onInputChange={(e, v, r) => {
              if (r === "clear") {
                setBookList([]);
              }
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
        <Container maxWidth="md">
          <DiscoverBooks />
        </Container>
      </TabPanel>
    </>
  );
}
