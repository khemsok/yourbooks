import { useState } from "react";

// MUI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// util
import moment from "moment";
import { db } from "../src/firebase.config";

const useStyles = makeStyles({
  hidden: {
    display: "-webkit-box",
    WebkitLineClamp: 4,
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
  },
});

export function TabPanel(props) {
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

export function ReadMore({ children }) {
  const classes = useStyles();

  const [isHidden, setIsHidden] = useState(true);
  return (
    <>
      <div>
        <div dangerouslySetInnerHTML={{ __html: children }} className={isHidden ? classes.hidden : null} />
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

export const displayDetails = (publishedDate, categories, rating) => {
  return [moment(publishedDate).format("YYYY"), categories && categories[0], rating ? `${rating}/5` : undefined].filter((el) => el !== undefined).join(" • ");
};

export const checkDocDetail = async (id, user = null) => {
  if (user) {
    const doc = await db.collection("books").where("bookId", "==", id).where("userId", "==", user.uid).limit(1).get();
    const docId = !doc.empty ? doc.docs[0].id : "";
    const docDetail = {
      read: doc.empty,
      docId: docId,
    };
    return docDetail;
  } else {
    return {
      read: null,
      docId: null,
    };
  }
};
