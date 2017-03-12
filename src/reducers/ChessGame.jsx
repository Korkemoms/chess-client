import ChessRules from '../components/ChessRules'

const chessState = new ChessRules()
chessState.init()
const chessStateHistory = []
chessStateHistory.push(chessState)

export const chessGameInitialState = {
  focusRow: -1,
  focusCol: -1,
  visualIndex: 0,
  actualIndex: 0,
  myEmail: null,
  myName: null,
  gameId: null,
  displayConfirmation: false,
  chessStateHistory: chessStateHistory,
  playerName: 'Player1',
  opponentName: 'Player2',
  myColor: 'White',
  spectator: true
}

const update = (state = chessGameInitialState, action) => {
  switch (action.type) {
    case 'SET_FOCUS':
      return Object.assign({}, state, {
        focusRow: action.focusRow,
        focusCol: action.focusCol
      })
    case 'SET_VISUAL_INDEX' :
      return Object.assign({}, state, {
        visualIndex: action.visualIndex
      })
    case 'SET_ACTUAL_INDEX' :
      return Object.assign({}, state, {
        actualIndex: action.actualIndex
      })
    case 'SET_DISPLAY_CONFIRMATION' :
      return Object.assign({}, state, {
        displayConfirmation: action.displayConfirmation
      })
    case 'SET_CHESS_STATE_HISTORY' :
      return Object.assign({}, state, {
        chessStateHistory: action.chessStateHistory
      })
    case 'CLEAR_CHESS_GAME' : {
      const chessState = new ChessRules()
      chessState.init()
      const chessStateHistory = []
      chessStateHistory.push(chessState)

      return Object.assign({}, state, {
        focusRow: -1,
        focusCol: -1,
        visualIndex: 0,
        actualIndex: 0,
        gameId: null,
        displayConfirmation: false,
        chessStateHistory: chessStateHistory,
        playerName: 'Player1',
        opponentName: 'Player2',
        myColor: 'White',
        spectator: true
      })
    }

    case 'RECEIVE_CHESS_GAMES': {
      let current = state // its not copied!

      let received
      Object.values(action.chessGames).forEach(game => {
        if (game.id === current.gameId) {
          received = game
        }
      })

      if (!received) {
        return Object.assign({}, state)
      }

      let imChallenger = received.challengerEmail === state.myEmail

      let playerName = !imChallenger ? received.opponentName
      : received.challengerName
      let playerEmail = !imChallenger ? received.opponentEmail
      : received.challengerEmail

      let opponentName = imChallenger ? received.opponentName
      : received.challengerName
      let opponentEmail = imChallenger ? received.opponentEmail
      : received.challengerEmail

      let spectator = opponentEmail !== state.myEmail && playerEmail !== state.myEmail

      return Object.assign({}, state, {
        playerName: playerName,
        playerEmail: playerEmail,
        opponentName: opponentName,
        opponentEmail: opponentEmail,
        displayConfirmation: false,
        myColor: imChallenger ? 'White' : 'Black',
        spectator: spectator
      })
    }

    case 'SELECT_GAME': {
      let imChallenger = action.selectedGame.challengerEmail === state.myEmail

      let playerName = !imChallenger ? action.selectedGame.opponentName
        : action.selectedGame.challengerName
      let playerEmail = !imChallenger ? action.selectedGame.opponentEmail
          : action.selectedGame.challengerEmail

      let opponentName = imChallenger ? action.selectedGame.opponentName
        : action.selectedGame.challengerName
      let opponentEmail = imChallenger ? action.selectedGame.opponentEmail
          : action.selectedGame.challengerEmail

      let spectator = opponentEmail !== state.myEmail && playerEmail !== state.myEmail

      const chessState = new ChessRules()
      chessState.init()
      const chessStateHistory = []
      chessStateHistory.push(chessState)

      return Object.assign({}, state, {
        focusRow: -1,
        focusCol: -1,
        visualIndex: 0,
        actualIndex: 0,
        playerName: playerName,
        playerEmail: playerEmail,
        opponentName: opponentName,
        opponentEmail: opponentEmail,
        chessStateHistory: chessStateHistory,
        gameId: action.selectedGame.id,
        displayConfirmation: false,
        myColor: imChallenger ? 'White' : 'Black',
        spectator: spectator
      })
    }

    case 'APP_RECEIVE_PROPS': {
      return Object.assign({}, state, {
        ...action.props
      })
    }
    default:
      return state
  }
}

export default update
