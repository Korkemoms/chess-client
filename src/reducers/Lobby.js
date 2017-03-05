const initialState = {
  players: []
}

export default function update (state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_PLAYERS':
      return Object.assign({}, state, {
        players: action.players
      })
    case 'SELECT_PLAYER':
      return Object.assign({}, state, {
        selectedPlayerEmail: action.selectedPlayerEmail
      })

    default:
      return state
  }
}
