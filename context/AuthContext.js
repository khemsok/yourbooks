import { useState, useEffect, useContext, createContext } from "react";

// util
import firebase from "firebase";
import auth from "../src/firebase.config";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => auth.signInWithPopup(provider));
  };

  const signOut = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    signIn,
    signOut,
  };
  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
}
