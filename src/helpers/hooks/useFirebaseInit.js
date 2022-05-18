import React from 'react';
import {initializeApp} from "firebase/app";
// import firebase from "firebase";
import { useEffect, useState } from "react";

export const useFirebaseInit = (config) => {
  const [loading, setLoading] = useState(true);
  const [fireInstance, setFireInstance] = useState();

  useEffect(() => {
    const inst = initializeApp(config);

    
    setFireInstance(inst);
    setLoading(false);

    return () => {
      setFireInstance(undefined);
    };
  }, [config, setLoading, setFireInstance]);

  return [fireInstance, loading];
};
