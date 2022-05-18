// import React from 'react';
import invariant from 'invariant'
import { useContext } from 'react'
import { FirebaseContext } from '../context/firebaseContext'

export const useFirebase = () => {
  const fbCtx = useContext(FirebaseContext)

  invariant(fbCtx, 'Firebase context is missing.')

  const { fireInstance } = fbCtx

  invariant(fireInstance, 'Firebase is not initialized.')

  return fbCtx
}
