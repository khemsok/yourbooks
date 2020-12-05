import firebase from "firebase";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDLJPw5_tZKg9iAk4-8gvN553SQddPu20c",
    authDomain: "yourbooks-7e202.firebaseapp.com",
    projectId: "yourbooks-7e202",
    storageBucket: "yourbooks-7e202.appspot.com",
    messagingSenderId: "325489487157",
    appId: "1:325489487157:web:456316afc724f999ed707c",
    measurementId: "G-MKRG0YD1B5",
  });
}

const auth = firebase.auth();
export default auth;
