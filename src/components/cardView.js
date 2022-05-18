import React, { useState, useEffect, useContext } from 'react'
import { Typography, Button, TextField, Box, Grid, Item } from '@mui/material'
import background from '../icons/star.png'

const CardView = ({
  user,
  curUser,
  setChecked,
  setBingoArr,
  queue,
  userCard,
  setBingo,
  gameStatus,
  winner,
}) => {
  console.log(curUser, curUser?.bingoArr, userCard)

  const ifBingo = () => {
    let pBingo = []
    curUser?.bingoArr?.forEach((b) => {
      pBingo.push(userCard.indexOf(b))
    })
    console.log(pBingo, userCard)
    if (pBingo.length !== 5) return false
    let a = Math.floor(pBingo[0] / 5)
    if (pBingo.filter((p) => Math.floor(p / 5) !== a)?.length === 0) return true
    a = pBingo[0] % 5
    if (pBingo.filter((p) => p % 5 !== a)?.length === 0) return true
    if (pBingo.filter((p) => Math.floor(p / 5) !== p % 5)?.length === 0)
      return true
    if (pBingo.filter((p) => Math.floor(p / 5) !== (24 - p) % 5)?.length === 0)
      return true
  }

  const ifChecked = (n) => {
    if (curUser?.checked && curUser?.checked?.indexOf(n) !== -1) return true
    return false
  }

  const ifBingoTemp = (n) => {
    if (curUser?.bingoArr && curUser?.bingoArr.indexOf(n) !== -1) return true
    return false
  }

  const handleBingo = (e) => {
    setBingo()
  }

  const handleCheck = (n) => {
    if (user?.uid !== curUser.userId) return
    if (gameStatus === 'done') return
    let temp = JSON.parse(
      JSON.stringify(curUser?.checked ? curUser?.checked : [])
    )
    if (queue?.indexOf(n) !== -1 || n === 0) {
      temp.push(n)
      setChecked(temp)
    }
    if (ifChecked(n)) {
      temp = JSON.parse(
        JSON.stringify(curUser?.bingoArr ? curUser?.bingoArr : [])
      )
      if (!ifBingoTemp(n)) {
        temp.push(n)
      } else {
        temp = temp.filter((t) => t !== n)
      }
      setBingoArr(temp)
    }
  }

  return (
    <>
      {winner === user?.uid && gameStatus === 'done' && (
        <Typography
          variant='h3'
          component='h3'
          mt={2}
          mb={1}
          sx={{ color: 'red' }}
        >
          Congulatuation! You're WIN!
        </Typography>
      )}
      {winner !== user?.uid && gameStatus === 'done' && (
        <Typography
          variant='h3'
          component='h3'
          mt={2}
          mb={1}
          sx={{ color: 'red' }}
        >
          Sorry, You're lost.
        </Typography>
      )}
      <Typography variant='h5' component='h5' mt={2} mb={1}>
        Random Call
      </Typography>
      <Grid container spacing={2} sx={{ margin: '10px' }}>
        {queue &&
          queue.map((ball, idx) => (
            <Box
              key={idx}
              sx={{
                width: '40px',
                height: '40px',
                background: 'orange',
                color: 'white',
                textAlign: 'center',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {ball}
            </Box>
          ))}
      </Grid>
      <Grid container spacing={0} sx={{ marginTop: '20px' }}>
        <Grid item xs={2}>
          <Box
            sx={{
              borderRadius: '5px',
              margin: '2px',
              padding: '2px',
              background: 'yellow',
              color: 'white',
              textAlign: 'center',
            }}
          >
            B
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              borderRadius: '5px',
              margin: '2px',
              padding: '2px',
              background: 'red',
              color: 'white',
              textAlign: 'center',
            }}
          >
            I
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              borderRadius: '5px',
              margin: '2px',
              padding: '2px',
              background: 'green',
              color: 'white',
              textAlign: 'center',
            }}
          >
            N
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              borderRadius: '5px',
              margin: '2px',
              padding: '2px',
              background: 'orange',
              color: 'white',
              textAlign: 'center',
            }}
          >
            G
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              borderRadius: '5px',
              margin: '2px',
              padding: '2px',
              background: 'blue',
              color: 'white',
              textAlign: 'center',
            }}
          >
            O
          </Box>
        </Grid>
        <Button
          variant='contained'
          sx={{ margin: '5px' }}
          disabled={!ifBingo()}
          onClick={handleBingo}
        >
          BINGO!
        </Button>
      </Grid>
      <Grid container>
        {curUser &&
          curUser.numbers?.map((n, idx) =>
            idx >= 0 && idx < 5 ? (
              <Grid key={idx} item xs={2}>
                <Box
                  onClick={() => handleCheck(n)}
                  sx={{
                    margin: '2px',
                    padding: '10px',
                    background: 'gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    id={`b_${n}`}
                    sx={{
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: ifBingoTemp(n)
                        ? 'red'
                        : ifChecked(n)
                        ? 'orange'
                        : 'gray',
                    }}
                  >
                    {n}
                  </Box>
                </Box>
              </Grid>
            ) : (
              <></>
            )
          )}
      </Grid>
      <Grid container>
        {curUser &&
          curUser.numbers?.map((n, idx) =>
            idx >= 5 && idx < 10 ? (
              <Grid key={idx} item xs={2}>
                <Box
                  onClick={() => handleCheck(n)}
                  sx={{
                    margin: '2px',
                    padding: '10px',
                    background: 'gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    id={`b_${n}`}
                    sx={{
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: ifBingoTemp(n)
                        ? 'red'
                        : ifChecked(n)
                        ? 'orange'
                        : 'gray',
                    }}
                  >
                    {n}
                  </Box>
                </Box>
              </Grid>
            ) : (
              <></>
            )
          )}
      </Grid>
      <Grid container>
        {curUser &&
          curUser.numbers?.map((n, idx) =>
            idx >= 10 && idx < 15 ? (
              <Grid key={idx} item xs={2}>
                <Box
                  onClick={() => handleCheck(n)}
                  sx={{
                    margin: '2px',
                    padding: '10px',
                    backgroundColor: 'gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    id={`b_${n}`}
                    sx={{
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: ifBingoTemp(n)
                        ? 'red'
                        : ifChecked(n)
                        ? 'orange'
                        : 'gray',
                      backgroundImage: n === 0 ? `url(${background})` : '',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                    }}
                  >
                    {n !== 0 ? n : ''}
                  </Box>
                </Box>
              </Grid>
            ) : (
              <></>
            )
          )}
      </Grid>
      <Grid container>
        {curUser &&
          curUser.numbers?.map((n, idx) =>
            idx >= 15 && idx < 20 ? (
              <Grid key={idx} item xs={2}>
                <Box
                  onClick={() => handleCheck(n)}
                  sx={{
                    margin: '2px',
                    padding: '10px',
                    background: 'gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    id={`b_${n}`}
                    sx={{
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: ifBingoTemp(n)
                        ? 'red'
                        : ifChecked(n)
                        ? 'orange'
                        : 'gray',
                    }}
                  >
                    {n}
                  </Box>
                </Box>
              </Grid>
            ) : (
              <></>
            )
          )}
      </Grid>
      <Grid container>
        {curUser &&
          curUser.numbers?.map((n, idx) =>
            idx >= 20 && idx < 25 ? (
              <Grid key={idx} item xs={2}>
                <Box
                  onClick={() => handleCheck(n)}
                  sx={{
                    margin: '2px',
                    padding: '10px',
                    background: 'gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    id={`b_${n}`}
                    sx={{
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: ifBingoTemp(n)
                        ? 'red'
                        : ifChecked(n)
                        ? 'orange'
                        : 'gray',
                    }}
                  >
                    {n}
                  </Box>
                </Box>
              </Grid>
            ) : (
              <></>
            )
          )}
      </Grid>
    </>
  )
}

export default CardView
