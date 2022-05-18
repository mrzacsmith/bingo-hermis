import React, { useState, useEffect } from 'react';
import { createContext } from "react";
import { useFirebaseInit } from "../hooks/useFirebaseInit";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export const FirebaseContext = createContext({ fireInstance: undefined });
FirebaseContext.displayName = "Firebase Context";

const FirebaseProvider = ({ children, config }) => {
  const [fireInstance, loading] = useFirebaseInit(config);
  const [user, setUser] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (fireInstance && !loading) {
      const auth = getAuth();
      signInAnonymously(auth)
        .then(() => {
          // Signed in..
        })
        .catch((error) => {
          setError(error.message);
        });
      onAuthStateChanged(auth, (_user) => {
        if (_user) {
          setUser(_user);
        } else {
          setUser(null);
        }
      });
    }
  }, [fireInstance, loading]);

  return (
    <FirebaseContext.Provider value={{ fireInstance, user, error }}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
