// determine where to send requests
const www = window.location.href.indexOf('www.') !== -1 ? 'www.' : ''
const url = process.env.NODE_ENV === 'production'
  ? `http://${www}amodahl.no/api/public` : `http://${www}local.amodahl.no`

export const receivePlayers = (players) => {
  return {
    type: 'RECEIVE_PLAYERS',
    players: players
  }
}

export const selectPlayer = (playerEmail) => {
  return {
    type: 'SELECT_PLAYER',
    selectedPlayerEmail: playerEmail
  }
}

export const requestPlayersFailed = (message, displayMessage) => {
  return {
    type: 'REQUEST_PLAYERS_FAILED',
    message: message
  }
}

export const requestPlayers = () => {
  return {
    type: 'REQUEST_PLAYERS'
  }
}

export const fetchPlayers = (myFetch) => {
  return (dispatch) => {
    dispatch(requestPlayers())

    return myFetch('/users', {
      method: 'GET'
    })
    .then(result => {
      dispatch(receivePlayers(result.data))
    })
    .catch(error => { // handle errors
      dispatch(requestPlayersFailed('Something went wrong: ' + error, true))
    })
  }
}
