import React, { useState, useEffect } from 'react'
import { createContext } from 'react'
import { useFirebaseInit } from '../hooks/useFirebaseInit'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

export const BingoContext = createContext({ fireInstance: undefined })
BingoContext.displayName = 'BINGO Context'

const BingoProvider = ({ children }) => {
  const [bingo, _setBingo] = useState()

  useEffect(() => {
    const _bingo = localStorage.getItem('bingo')
      ? JSON.parse(localStorage.getItem('bingo'))
      : null
    _setBingo(_bingo)
  }, [])

  const setBingo = (game) => {
    localStorage.setItem('bingo', game ? JSON.stringify(game) : '')
    _setBingo(game)
  }

  return (
    <BingoContext.Provider
      value={{
        bingo,
        setBingo,
      }}
    >
      {children}
    </BingoContext.Provider>
  )
}

export default BingoProvider
