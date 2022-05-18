import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { useFirebase } from '../helpers/hooks/useFirebase'
import {
  getDatabase,
  ref,
  onValue,
  set,
  child,
  push,
  update,
  get,
} from 'firebase/database'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { Typography, Button, TextField, Box, Grid, Item } from '@mui/material'
import { BingoContext } from '../helpers/context/bingoContext'
import { getAuth, updateProfile } from 'firebase/auth'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { orange } from '@mui/material/colors'
import { ContentCopy, Person } from '@mui/icons-material'
import { generateUserCard } from '../utils/utils'
import CardView from '../components/cardView'

const theme = createTheme({
  status: {
    danger: orange[500],
  },
})

const Game = ({}) => {
  const rdb = getDatabase()
  const { gameIdParam } = useParams()
  const { bingo, setBingo } = useContext(BingoContext)
  const auth = getAuth()
  const [displayName, setDisplayName] = useState('')

  const { user } = useFirebase()
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState()
  const [queue, setQueue] = useState([])

  const [bingoRef, setBingoRef] = useState()
  const [usersRef, setUsersRef] = useState()

  const userRef = ref(rdb, `games/${gameIdParam}/users/${user?.uid}`)

  const castInterval = useRef()

  const [gameStatus, setGameStatus] = useState()
  const [winner, setWinner] = useState()

  useEffect(() => {
    if (user) {
      const _usersRef = ref(rdb, `games/${gameIdParam}/users/`)
      const _bingoRef = ref(rdb, `games/${gameIdParam}/`)

      setUsersRef(_usersRef)
      setBingoRef(_bingoRef)

      onValue(_usersRef, (snapshot) => {
        const data = snapshot.val()
        let temp = []
        if (data) {
          Object.keys(data).forEach((key) => {
            temp.push(data[key])
          })
          setUsers(temp)
          console.log(
            'hello',
            currentUser,
            temp,
            temp.filter((t) => t.userId === currentUser?.userId)[0]
          )
          setCurrentUser(temp.filter((t) => t.userId === user?.uid)[0])
        }
      })

      onValue(_bingoRef, (snapshot) => {
        const data = snapshot.val()
        console.log('bingo', data?.queue)
        setQueue(data?.queue ? data?.queue : [])
        setGameStatus(data?.status)
        setWinner(data?.winner)
        if (data?.status === 'done') {
          clearInterval(castInterval.current)
        }
      })
    }
  }, [user])

  useEffect(() => {
    console.log('hello')
  }, [usersRef])

  const [userCard, setUserCard] = useState([])

  useEffect(() => {
    const card = generateUserCard()
    setUserCard(card)
  }, [])

  const handleDeleteGame = async (e) => {
    try {
      await set(ref(rdb, 'games/' + gameIdParam), null)
      setBingo()
      window.location.href = '/'
    } catch (err) {
      console.log(err)
    }
  }

  const handleLeaveGame = async (e) => {
    try {
      await set(ref(rdb, `games/${gameIdParam}/users/${user?.uid}`), null)
      setBingo()
      window.location.href = '/'
    } catch (err) {
      console.log(err)
    }
  }

  const handleReady = (e) => {
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val())
          update(ref(rdb, `games/${gameIdParam}/users/${user?.uid}`), {
            name: displayName,
            numbers: userCard,
            checked: [],
            status: false,
          })
        } else {
          set(ref(rdb, `games/${gameIdParam}/users/${user?.uid}`), {
            userId: user?.uid,
            name: displayName,
            isAdmin: bingo?.isAdmin ? true : false,
            numbers: userCard,
            checked: [],
            status: false,
          })
        }
      })
      .catch((error) => {
        console.error(error)
      })

    updateProfile(auth.currentUser, {
      displayName: displayName,
    })
      .then(() => {
        console.log(auth.currentUser)
      })
      .catch((error) => {
        // An error occurred
        // ...
      })
  }

  const castBall = async () => {
    get(bingoRef).then((snapshot) => {
      const _bingo = snapshot.val()
      let temp = JSON.parse(JSON.stringify(_bingo?.queue ? _bingo?.queue : []))
      let cast = []
      for (let i = 1; i <= 75; i++) {
        if (temp.indexOf(i) === -1) {
          cast.push(i)
        }
      }
      if (cast.length === 0) {
        clearInterval(castInterval.current)
        update(bingoRef, {
          queue: [],
          status: 'ready',
        })
        return
      }

      let idx = Math.floor(cast.length * Math.random())
      if (idx === cast.length) idx = cast.length - 1

      temp.push(cast[idx])
      console.log('update bingo', temp)
      update(bingoRef, {
        queue: temp,
      })
    })
  }

  const handleStartGame = async (e) => {
    await update(bingoRef, {
      queue: [],
      status: 'started',
      winner: [],
    })
    console.log(users)
    users?.forEach((_user) => {
      update(ref(rdb, `games/${gameIdParam}/users/${_user?.userId}`), {
        checked: [],
        bingoArr: [],
        status: false,
      })
    })

    setWinner()

    if (castInterval.current) {
      clearInterval(castInterval.current)
    }
    castInterval.current = setInterval(castBall, 2000)
  }

  const setChecked = (arr) => {
    console.log(arr)
    update(ref(rdb, `games/${gameIdParam}/users/${user?.uid}`), {
      checked: arr,
    })
  }

  const setBingoArr = (arr) => {
    console.log(arr)
    update(ref(rdb, `games/${gameIdParam}/users/${user?.uid}`), {
      bingoArr: arr,
    })
  }

  const setBingoWin = () => {
    clearInterval(castInterval.current)
    update(ref(rdb, `games/${gameIdParam}/`), {
      status: 'done',
      winner: user?.uid,
    })

    users?.forEach((_user) => {
      let status = user?.uid === _user?.userId ? 'winner' : 'lose'
      update(ref(rdb, `games/${gameIdParam}/users/${_user?.userId}`), {
        status: status,
      })
    })

    // update(ref(rdb, `games/${gameIdParam}/users/${user?.uid}`), {
    // 	status: 'winner'
    // })
  }

  return (
    <div className='container'>
      <ThemeProvider theme={theme}>
        <Grid container spacing={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              marginTop: '30px',
            }}
          >
            <Typography variant='h5' component='h5' mr={3}>
              Online Users:
            </Typography>
            {users &&
              users.map((user) => (
                <Button
                  key={user?.userId}
                  sx={{
                    margin: '3px',
                    color: 'white',
                    background:
                      currentUser?.userId === user.userId ? 'blue' : 'gray',
                  }}
                  onClick={() => setCurrentUser(user)}
                >
                  <Person />
                  {user?.name}
                </Button>
              ))}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              {bingo?.isAdmin && (
                <Button
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <ContentCopy />

                  <p>game url</p>
                </Button>
              )}
              <TextField
                label='name'
                variant='outlined'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Button
                variant='contained'
                style={{ marginLeft: '30px' }}
                onClick={handleReady}
              >
                Ready
              </Button>
            </Grid>
            <Grid item xs={4}>
              {bingo?.isAdmin && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Button variant='contained' onClick={handleStartGame}>
                    Start Game
                  </Button>

                  <Button variant='contained' onClick={handleDeleteGame}>
                    End Game
                  </Button>
                </div>
              )}
              {!bingo?.isAdmin && (
                <Button variant='contained' onClick={handleLeaveGame}>
                  Leave Game
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>

        <CardView
          user={user}
          userCard={userCard}
          curUser={currentUser}
          queue={queue}
          setChecked={setChecked}
          setBingoArr={setBingoArr}
          setBingo={setBingoWin}
          gameStatus={gameStatus}
          winner={winner}
        />
      </ThemeProvider>
    </div>
  )
}

export default Game
