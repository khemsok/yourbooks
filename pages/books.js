import { useState, useEffect, useReducer, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Router from "next/router";

// Context
import { useAuth } from "../context/AuthContext";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Rating from "@material-ui/lab/Rating";
import Tooltip from "@material-ui/core/Tooltip";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

// MUI Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

// util
import BarLoader from "react-spinners/BarLoader";
import { db } from "../src/firebase.config";
import { ReadMore, displayDetails, estReadingTime, checkDocExists } from "../util/reusableComponents";
import { isMobile } from "react-device-detect";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { debounce } from "lodash";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    // color: green[500],
    color: "black",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  booksThumbnailContainer: {
    minWidth: "170px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "120px",
    },
  },
  booksThumbnail: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: "90px",
    },
  },
  booksTitle: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1em",
    },
  },
  booksAuthor: {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8em",
      marginBottom: "5px",
    },
  },
  booksDetail: {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".6em",
      marginBottom: "5px",
    },
  },
  booksDescription: {
    marginBottom: "20px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".65em",
    },
  },
  booksNotes: {
    [theme.breakpoints.down("sm")]: {
      fontSize: ".65em",
    },
  },
  booksEstReadingTime: {
    fontSize: ".85em",
    marginBottom: "10px",
    fontStyle: "italic",
    display: "inline-block",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".6em",
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Autosave({ docId, notesValue, setIsLoadingNotes }) {
  const didMountRef = useRef(false);
  const debouncedSave = useCallback(
    debounce(async (newNotesValue) => {
      console.log("hello am i firing?");

      setIsLoadingNotes(true);
      await db.doc(`/books/${docId}`).update({ notes: newNotesValue });
      setTimeout(() => {
        setIsLoadingNotes(false);
      }, 1000);
    }, 2000),
    []
  );

  useEffect(() => {
    if (didMountRef.current) {
      debouncedSave(notesValue);
    } else {
      didMountRef.current = true;
    }
  }, [notesValue]);

  return null;
}

function booksReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

export default function Books() {
  const classes = useStyles();

  const router = useRouter();
  const { id } = router.query;

  const { user } = useAuth();

  const [bookUserStatus, setBookUserStatus] = useState(null);
  const [notesValue, setNotesValue] = useState("");
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [submitNotes, setSubmitNotes] = useState(false);
  const [rating, setRating] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const initialState = {
    id: id,
    data: null,
    isLoading: true,
    error: "",
  };

  const [{ id: bookId, data, isLoading, error }, dispatch] = useReducer(booksReducer, initialState);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSubmitNotes(false);
  };

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const data = await res.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAILURE", payload: err });
      }
    }
    async function fetchBookUserStatus() {
      try {
        const doc = await db.collection("books").where("bookId", "==", id).where("userId", "==", user.uid).limit(1).get();
        if (!doc.empty) {
          setBookUserStatus({ docId: doc.docs[0].id, data: doc.docs[0].data() });
          setNotesValue(doc.docs[0].data().notes);
          setRating(doc.docs[0].data().rating ? doc.docs[0].data().rating : null);
          setStartDate(doc.docs[0].data().start ? doc.docs[0].data().start : null);
          setEndDate(doc.docs[0].data().end ? doc.docs[0].data().end : null);
        } else {
          setBookUserStatus(null);
          setNotesValue("");
          setRating(null);
        }
      } catch (e) {
        console.error(e);
        setBookUserStatus(null);
        setNotesValue("");
        setRating(null);
      }
    }
    fetchData();
    fetchBookUserStatus();
  }, [id, user]);
  console.log(bookUserStatus, "bookuserstatus");
  console.log(data, "test data");

  console.log(isLoadingNotes, "tesadfasdfasdf");
  return (
    <>
      <Container maxWidth="xl">
        <IconButton onClick={() => Router.back()} size={isMobile ? "small" : "medium"}>
          <ArrowBackIcon />
        </IconButton>
      </Container>
      <Container maxWidth="md">
        {!isLoading ? (
          <>
            <div style={{ display: "flex" }}>
              <div className={classes.booksThumbnailContainer}>
                <img src={data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail} className={classes.booksThumbnail} />
              </div>
              <div>
                <Typography variant="h6" className={classes.booksTitle}>
                  {data.volumeInfo.title}
                  {data.volumeInfo.subtitle && `: ${data.volumeInfo.subtitle}`}
                </Typography>
                <Typography variant="body1" className={classes.booksAuthor}>
                  {data.volumeInfo.authors && data.volumeInfo.authors.join(", ")}
                </Typography>

                <Typography variant="body2" className={classes.booksDetail}>
                  {displayDetails(data.volumeInfo.publishedDate, data.volumeInfo.categories, data.volumeInfo.averageRating)}
                </Typography>

                {data.volumeInfo.pageCount ? (
                  <Tooltip title={`${data.volumeInfo.pageCount} pages`} placement="top">
                    <Typography variant="body1" className={classes.booksEstReadingTime}>
                      {estReadingTime(data.volumeInfo.pageCount)}
                    </Typography>
                  </Tooltip>
                ) : null}

                {user && bookUserStatus && Object.keys(bookUserStatus).length !== 0 ? (
                  <>
                    <div>
                      <Rating
                        value={rating}
                        size="small"
                        style={{ marginBottom: "10px" }}
                        onChange={async (e, value) => {
                          await db.doc(`/books/${bookUserStatus.docId}`).update({ rating: value });
                          setRating(value);
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div style={{ display: "flex", alignItems: "flex-end", maxWidth: "150px", marginRight: "20px", fontSize: ".8em" }}>
                          <DatePicker
                            margin="none"
                            // variant="inline"
                            label="Start Date"
                            format="MM/dd/yyyy"
                            value={startDate}
                            onChange={async (date) => {
                              const updateDate = moment(date).format("YYYY-MM-DD");
                              await db.doc(`/books/${bookUserStatus.docId}`).update({ start: updateDate });
                              setStartDate(updateDate);
                            }}
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                          />
                          <IconButton
                            // style={{ padding: 0 }}
                            edge="end"
                            size="small"
                            disabled={!startDate}
                            onClick={async () => {
                              await db.doc(`/books/${bookUserStatus.docId}`).update({ start: null });
                              setStartDate(null);
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-end", maxWidth: "150px", fontSize: ".8em" }}>
                          <DatePicker
                            margin="none"
                            label="End Date"
                            format="MM/dd/yyyy"
                            value={endDate}
                            onChange={async (date) => {
                              try {
                                const updateDate = moment(date).format("YYYY-MM-DD");
                                await db.doc(`/books/${bookUserStatus.docId}`).update({ end: updateDate, completeStatus: true });
                                setEndDate(updateDate);
                              } catch (e) {}
                            }}
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                          />
                          <IconButton
                            // style={{ padding: 0 }}
                            edge="end"
                            size="small"
                            disabled={!endDate}
                            onClick={async () => {
                              await db.doc(`/books/${bookUserStatus.docId}`).update({ end: null, completeStatus: false });
                              setEndDate(null);
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </div>
                      </MuiPickersUtilsProvider>
                    </div>
                  </>
                ) : null}

                <Typography variant="body2" className={classes.booksDescription}>
                  {data.volumeInfo.description ? <ReadMore>{data.volumeInfo.description}</ReadMore> : null}
                </Typography>
              </div>
            </div>
            {user && bookUserStatus && Object.keys(bookUserStatus).length !== 0 ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 2 : 4}
                  label="Notes"
                  variant="outlined"
                  defaultValue={notesValue}
                  rowsMax={15}
                  InputLabelProps={{ style: {} }}
                  InputProps={{
                    endAdornment: isLoadingNotes ? (
                      <>
                        <InputAdornment position="start">
                          <CircularProgress size="2em" />
                        </InputAdornment>{" "}
                      </>
                    ) : null,
                  }}
                  className={classes.booksNotes}
                  onChange={(e) => {
                    setNotesValue(e.target.value);
                  }}
                />
                <Autosave docId={bookUserStatus.docId} notesValue={notesValue} setIsLoadingNotes={setIsLoadingNotes} />
                {/* <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={classes.wrapper}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isLoadingNotes}
                      onClick={async () => {
                        setIsLoadingNotes(true);
                        setSubmitNotes(false);
                        await db.doc(`/books/${bookUserStatus.docId}`).update({ notes: notesValue });
                        setIsLoadingNotes(false);
                        setSubmitNotes(true);
                      }}
                    >
                      Save
                    </Button>
                    {isLoadingNotes && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </div>
                </div> */}
                {/* <Snackbar open={submitNotes} autoHideDuration={2000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="info">
                    Successfully updated...
                  </Alert>
                </Snackbar> */}
              </>
            ) : null}
          </>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BarLoader color={"#000"} loading={isLoading} />
          </div>
        )}
      </Container>
    </>
  );
}
