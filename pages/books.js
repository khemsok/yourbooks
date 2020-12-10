import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Router from "next/router";

// MUI
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

// MUI Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";

// util
import BarLoader from "react-spinners/BarLoader";
import { ReadMore, displayDetails } from "../util/reusableComponents";

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
  const router = useRouter();
  const { id } = router.query;

  console.log(id, "testing id");

  const initialState = {
    id: id,
    data: null,
    isLoading: true,
    error: "",
  };

  const [{ id: bookId, data, isLoading, error }, dispatch] = useReducer(booksReducer, initialState);

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
    fetchData();
  }, [id]);

  console.log({ data, isLoading, error }, "test reducer");
  return (
    <>
      <Container maxWidth="xl">
        <IconButton onClick={() => Router.back()}>
          <ArrowBackIcon />
        </IconButton>
      </Container>
      <Container maxWidth="md">
        {!isLoading ? (
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
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BarLoader color={"#000"} loading={isLoading} />
          </div>
        )}
      </Container>
    </>
  );
}
