import { useState, useEffect, useReducer } from "react";
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
import { makeStyles } from "@material-ui/core/styles";

// MUI Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";

// util
import BarLoader from "react-spinners/BarLoader";
import { db } from "../src/firebase.config";
import { ReadMore, displayDetails, checkDocExists } from "../util/reusableComponents";

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
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
        } else {
          setBookUserStatus(null);
          setNotesValue("");
        }
      } catch (e) {
        console.error(e);
        setBookUserStatus(null);
        setNotesValue("");
      }
    }
    fetchData();
    fetchBookUserStatus();
  }, [id, user]);
  console.log(data, "bookuserstatus");
  return (
    <>
      <Container maxWidth="xl">
        <IconButton onClick={() => Router.back()}>
          <ArrowBackIcon />
        </IconButton>
      </Container>
      <Container maxWidth="md">
        {!isLoading ? (
          <>
            <div style={{ display: "flex" }}>
              <div style={{ minWidth: "170px" }}>
                <img src={data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail} />
              </div>
              <div>
                <Typography variant="h6">
                  {data.volumeInfo.title}
                  {data.volumeInfo.subtitle && `: ${data.volumeInfo.subtitle}`}
                </Typography>
                <Typography variant="body1">{data.volumeInfo.authors && data.volumeInfo.authors.join(", ")}</Typography>

                <Typography variant="body2">{displayDetails(data.volumeInfo.publishedDate, data.volumeInfo.categories, data.volumeInfo.averageRating)}</Typography>

                <Typography variant="body2">{data.volumeInfo.description ? <ReadMore>{data.volumeInfo.description}</ReadMore> : null}</Typography>
              </div>
            </div>
            {user && bookUserStatus && Object.keys(bookUserStatus).length !== 0 ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  variant="outlined"
                  defaultValue={notesValue}
                  onChange={(e) => {
                    setNotesValue(e.target.value);
                  }}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
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
                      Submit
                    </Button>
                    {isLoadingNotes && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </div>
                </div>
                <Snackbar open={submitNotes} autoHideDuration={2000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="info">
                    Successfully updated...
                  </Alert>
                </Snackbar>
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
