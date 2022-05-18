import React, { useEffect, useContext } from 'react'
import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useFirebase } from '../helpers/hooks/useFirebase'
import {
  getDatabase,
  ref,
  onValue,
  set,
  child,
  push,
  update,
} from 'firebase/database'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { Typography, Button } from '@mui/material'
import { BingoContext } from '../helpers/context/bingoContext'
import { generateUserCard } from '../utils/utils'

const Main = ({}) => {
  const [loading, setLoading] = useState(true)
  const rdb = getDatabase()
  const starCountRef = ref(rdb, 'games/')

  const { bingo, setBingo } = useContext(BingoContext)
  const { user } = useFirebase()
  const userCard = generateUserCard()

  useEffect(() => {
    if (user && rdb) {
      setLoading(false)
    }
  }, [user, rdb])

  useEffect(() => {
    if (
      bingo?.id !== undefined &&
      bingo?.id !== null &&
      bingo?.id !== '' &&
      bingo?.id !== 'undefined'
    ) {
      window.location.href = `/game/${bingo?.id}`
    }
  }, [bingo?.id])

  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val()
    console.log(data)
  })

  const handleCreateNewGame = async (e) => {
    const id = `g_${new Date().getTime()}`
    await set(ref(rdb, 'games/' + id), {
      gameId: id,
      status: 'ready',
      queue: [],
      users: [],
    })
    await set(ref(rdb, `games/${id}/users/${user?.uid}`), {
      userId: user?.uid,
      isAdmin: true,
      numbers: userCard,
      checked: [],
      status: false,
    })
    setBingo({
      id,
      isAdmin: true,
    })
  }

  return (
    <div className='container'>
      <div className='flex'>
        <Typography variant='h3' component='h3' mt={2} mb={2}>
          Online Live BINGO
        </Typography>
        <Button
          disabled={loading}
          variant='contained'
          onClick={handleCreateNewGame}
        >
          New Game
        </Button>
      </div>
    </div>
  )
}

export default Main
