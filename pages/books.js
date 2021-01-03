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
import Rating from "@material-ui/lab/Rating";
import Tooltip from "@material-ui/core/Tooltip";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

// MUI Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

// util
import BarLoader from "react-spinners/BarLoader";
import { db } from "../src/firebase.config";
import {
  ReadMore,
  displayDetails,
  estReadingTime,
  RemoveBookAlert,
} from "../util/reusableComponents";
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
  booksContainer: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  booksThumbnailContainer: {
    minWidth: "170px",
    [theme.breakpoints.down("sm")]: {
      // minWidth: "120px",
    },
  },
  booksThumbnail: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100px",
      marginBottom: "10px",
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
  startDatePicker: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
    },
  },
  datePickerInput: {
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8em",
    },
  },
  datePickerLabel: {
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8em",
    },
  },
  textFieldInput: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
  },
  textFieldLabel: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.3em",
    },
  },
  clearIcon: {
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8em",
    },
  },
  readingList: {
    fontSize: ".8em",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".65em",
    },
  },
  readingIcon: {
    fontSize: "1em",
    marginRight: "3px",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8em",
    },
  },
}));

function Autosave({ docId, notesValue, setIsLoadingNotes }) {
  const didMountRef = useRef(false);

  const debouncedSave = useCallback(
    debounce(async (newNotesValue) => {
      setIsLoadingNotes(true);
      try {
        console.log("debounce saved");
        await db.doc(`/books/${docId}`).update({ notes: newNotesValue });
        setTimeout(() => {
          setIsLoadingNotes(false);
        }, 1000);
      } catch (e) {
        console.error(e);
        setIsLoadingNotes(false);
      }
    }, 1000),
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
  const [rating, setRating] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const initialState = {
    id: id,
    data: null,
    isLoading: true,
    error: "",
  };

  const [{ id: bookId, data, isLoading, error }, dispatch] = useReducer(
    booksReducer,
    initialState
  );

  async function fetchData() {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}`
      );
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_FAILURE", payload: err });
    }
  }

  async function fetchBookUserStatus() {
    try {
      const doc = await db
        .collection("books")
        .where("bookId", "==", id)
        .where("userId", "==", user.uid)
        .limit(1)
        .get();
      console.log("fetchbookuserstatus", id);
      if (!doc.empty) {
        setBookUserStatus({ docId: doc.docs[0].id, data: doc.docs[0].data() });
        setNotesValue(doc.docs[0].data().notes);
        setRating(doc.docs[0].data().rating ? doc.docs[0].data().rating : null);
        setStartDate(
          doc.docs[0].data().start ? doc.docs[0].data().start : null
        );
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

  useEffect(() => {
    fetchData();

    if (user) {
      fetchBookUserStatus();
    }
  }, [id, user]);

  // useEffect(() => {
  //   if (user) {
  //     fetchBookUserStatus();
  //   }
  // }, [endDate]);
  // console.log(bookUserStatus, "bookuserstatus");
  // console.log(data, "test data");

  // console.log(isLoadingNotes, "tesadfasdfasdf");
  return (
    <>
      <Container maxWidth="xl" style={{ marginBottom: "10px" }}>
        <IconButton
          onClick={() => Router.back()}
          size={isMobile ? "small" : "medium"}
        >
          <ArrowBackIcon />
        </IconButton>
      </Container>
      <Container maxWidth="md">
        {!isLoading ? (
          <>
            <div className={classes.booksContainer}>
              <div className={classes.booksThumbnailContainer}>
                <img
                  src={
                    data.volumeInfo.imageLinks
                      ? data.volumeInfo.imageLinks.thumbnail
                      : "/no_cover.svg"
                  }
                  className={classes.booksThumbnail}
                />
              </div>
              <div>
                <Typography variant="h6" className={classes.booksTitle}>
                  {data.volumeInfo.title}
                  {data.volumeInfo.subtitle && `: ${data.volumeInfo.subtitle}`}
                </Typography>
                <Typography variant="body1" className={classes.booksAuthor}>
                  {data.volumeInfo.authors &&
                    data.volumeInfo.authors.join(", ")}
                </Typography>

                <Typography variant="body2" className={classes.booksDetail}>
                  {displayDetails(
                    data.volumeInfo.publishedDate,
                    data.volumeInfo.categories,
                    data.volumeInfo.averageRating
                  )}
                </Typography>

                {data.volumeInfo.pageCount ? (
                  <Tooltip
                    title={`${data.volumeInfo.pageCount} pages`}
                    placement="top"
                  >
                    <Typography
                      variant="body1"
                      className={classes.booksEstReadingTime}
                    >
                      {estReadingTime(data.volumeInfo.pageCount)}
                    </Typography>
                  </Tooltip>
                ) : null}

                {user &&
                bookUserStatus &&
                Object.keys(bookUserStatus).length !== 0 ? (
                  <>
                    <div>
                      <Rating
                        value={rating}
                        size="small"
                        style={{ marginBottom: "10px" }}
                        onChange={async (e, value) => {
                          setRating(value);
                          await db
                            .doc(`/books/${bookUserStatus.docId}`)
                            .update({ rating: value });
                        }}
                        name="rating"
                      />
                    </div>
                    <div
                      style={{
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            maxWidth: "150px",
                            marginRight: "20px",
                          }}
                          className={classes.startDatePicker}
                        >
                          <DatePicker
                            margin="none"
                            // variant="inline"
                            label="Start Date"
                            format="MM/dd/yyyy"
                            value={startDate}
                            InputProps={{ className: classes.datePickerInput }}
                            InputLabelProps={{
                              className: classes.datePickerLabel,
                            }}
                            onChange={async (date) => {
                              const updateDate = moment(date).format(
                                "MM/DD/YYYY"
                              );
                              setStartDate(updateDate);
                              await db
                                .doc(`/books/${bookUserStatus.docId}`)
                                .update({ start: updateDate });
                            }}
                          />
                          <IconButton
                            // style={{ padding: 0 }}
                            edge="end"
                            size="small"
                            disabled={!startDate}
                            onClick={async () => {
                              await db
                                .doc(`/books/${bookUserStatus.docId}`)
                                .update({ start: null });
                              setStartDate(null);
                            }}
                          >
                            <ClearIcon className={classes.clearIcon} />
                          </IconButton>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            maxWidth: "150px",
                          }}
                        >
                          <DatePicker
                            margin="none"
                            label="End Date"
                            format="MM/dd/yyyy"
                            value={endDate}
                            InputProps={{ className: classes.datePickerInput }}
                            InputLabelProps={{
                              className: classes.datePickerLabel,
                            }}
                            onChange={async (date) => {
                              try {
                                const updateDate = moment(date).format(
                                  "MM/DD/YYYY"
                                );
                                setEndDate(updateDate);

                                await db
                                  .doc(`/books/${bookUserStatus.docId}`)
                                  .update({
                                    end: updateDate,
                                    completeStatus: true,
                                  });
                              } catch (e) {}
                            }}
                          />
                          <IconButton
                            // style={{ padding: 0 }}
                            edge="end"
                            size="small"
                            disabled={!endDate}
                            onClick={async () => {
                              await db
                                .doc(`/books/${bookUserStatus.docId}`)
                                .update({ end: null, completeStatus: false });
                              setEndDate(null);
                            }}
                          >
                            <ClearIcon className={classes.clearIcon} />
                          </IconButton>
                        </div>
                      </MuiPickersUtilsProvider>
                    </div>
                  </>
                ) : null}

                {/* <div className={classes.booksDescription}>{data.volumeInfo.description ? <ReadMore>{data.volumeInfo.description}</ReadMore> : null}</div> */}
                <ReadMore description={data.volumeInfo.description} />
              </div>
            </div>
            {user ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "10px",
                }}
              >
                {bookUserStatus ? (
                  <Button
                    onClick={async () => {
                      setAlertOpen(true);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <RemoveIcon className={classes.readingIcon} />
                      <Typography
                        variant="body2"
                        className={classes.readingList}
                      >
                        Remove from Reading List
                        {/* {bookUserStatus.data.completeStatus ? "Remove from Finished Books" : "Remove from Reading List"} */}
                      </Typography>
                    </div>
                  </Button>
                ) : (
                  <Button
                    onClick={async () => {
                      try {
                        const doc = await db
                          .collection("books")
                          .where("bookId", "==", data.id)
                          .where("userId", "==", user.uid)
                          .limit(1)
                          .get();
                        console.log("get book");
                        if (doc.empty) {
                          await db.collection("books").add({
                            bookId: data.id,
                            data: data.volumeInfo,
                            start: moment().format("MM/DD/YYYY"),
                            end: "",
                            userId: user.uid,
                            rating: 0,
                            completeStatus: false,
                            notes: "",
                          });
                          await fetchBookUserStatus();
                          console.log("add book and fetchuserstatus");
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <AddIcon className={classes.readingIcon} />
                      <Typography
                        variant="body2"
                        className={classes.readingList}
                      >
                        Add to Reading List
                      </Typography>
                    </div>
                  </Button>
                )}
              </div>
            ) : null}

            {/* </div> */}
            {user &&
            bookUserStatus &&
            Object.keys(bookUserStatus).length !== 0 ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 2 : 4}
                  label="Notes"
                  variant="outlined"
                  defaultValue={notesValue}
                  rowsMax={15}
                  style={{ marginBottom: "10px" }}
                  InputLabelProps={{ className: classes.textFieldLabel }}
                  InputProps={{
                    className: classes.textFieldInput,
                    endAdornment: isLoadingNotes ? (
                      <>
                        <InputAdornment position="start">
                          <CircularProgress size="1em" />
                        </InputAdornment>{" "}
                      </>
                    ) : null,
                  }}
                  className={classes.booksNotes}
                  onChange={(e) => {
                    setNotesValue(e.target.value);
                  }}
                />
                <Autosave
                  docId={bookUserStatus.docId}
                  notesValue={notesValue}
                  setIsLoadingNotes={setIsLoadingNotes}
                />
              </>
            ) : null}
            <>
              <RemoveBookAlert
                open={alertOpen}
                setOpen={setAlertOpen}
                bookUserStatus={bookUserStatus}
                fetchBookUserStatus={fetchBookUserStatus}
                componentType="books"
              />
            </>
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
