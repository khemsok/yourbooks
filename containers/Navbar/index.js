import { useState, useContext } from "react";
import Link from "next/link";

// MUI
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

// Context
import { useAuth } from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  mainTitle: {
    fontSize: "2.5em",
    "& span": {
      fontWeight: "300",
    },
    cursor: "pointer",
    [theme.breakpoints.down("md")]: {
      fontSize: "2em",
    },
  },
  mainTitleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "40px 0",
  },
  rightNavContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& h5": {
      fontSize: "1.3em",
      padding: "0 10px",
      "& span": {
        fontWeight: "700",
      },
    },
    "& div": {
      padding: "0 10px",
      borderLeft: "1px solid black",
    },
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "flex-end",
      "& div": {
        border: "none",
        fontSize: ".75em",
      },
      "& h5": {
        fontSize: ".95em",
        textAlign: "right",
      },
    },
  },
  signButton: {
    fontSize: "1em",
    cursor: "pointer",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Navbar() {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const { user, signIn, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      setError("");
      await signIn();
    } catch (err) {
      if ((err.code && err.code !== "auth/popup-closed-by-user") || !err.code) {
        setError("Failed to Sign In");
        setOpen(true);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <div className={classes.mainTitleContainer}>
        <div>
          <Link href="/">
            <Typography variant="h1" className={classes.mainTitle}>
              <span>YOUR</span>BOOKS
            </Typography>
          </Link>
        </div>
        <div>
          <div className={classes.rightNavContainer}>
            {user ? (
              <>
                <Typography variant="h5">
                  Welcome, <span>{user.displayName}</span>
                </Typography>
                <div>
                  <Typography className={classes.signButton} onClick={signOut}>
                    Sign Out
                  </Typography>
                </div>
              </>
            ) : (
              <Typography className={classes.signButton} onClick={handleSignIn}>
                Sign In
              </Typography>
            )}
          </div>
        </div>
      </div>
      <div>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
