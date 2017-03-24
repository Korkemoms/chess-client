import ChessRules from '../components/ChessRules'

const chessState = new ChessRules()
// chessState.init()
const chessStateHistory = [chessState]

export const chessGameInitialState = {
  focusRow: -1,
  focusCol: -1,
  visualIndex: 0,
  actualIndex: 0,
  myUid: null,
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
      // fresh history
      const chessState = new ChessRules()
      // chessState.init()
      const chessStateHistory = [chessState]

      // blank game
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

      // determine if we receive info about current game (same id)
      let received
      Object.values(action.chessGames).forEach(game => {
        if (game.id === current.gameId) {
          received = game
        }
      })

      if (!received) {
        return Object.assign({}, state)
      }

      // we received info about current game

      // determine some values
      let imChallenger = received.challengerUid === state.myUid
      let playerName = !imChallenger ? received.opponentName
      : received.challengerName
      let playerUid = !imChallenger ? received.opponentUid
      : received.challengerUid
      let opponentName = imChallenger ? received.opponentName
      : received.challengerName
      let opponentUid = imChallenger ? received.opponentUid
      : received.challengerUid
      let spectator = opponentUid !== state.myUid && playerUid !== state.myUid

      // copy info received into current game
      return Object.assign({}, state, {
        playerName: playerName,
        playerUid: playerUid,
        opponentName: opponentName,
        opponentUid: opponentUid,
        displayConfirmation: false,
        myColor: imChallenger ? 'White' : 'Black',
        spectator: spectator
      })
    }

    case 'SELECT_GAME': {
      // determine some values
      let imChallenger = action.selectedGame.challengerUid === state.myUid
      let playerName = !imChallenger ? action.selectedGame.opponentName
        : action.selectedGame.challengerName
      let playerUid = !imChallenger ? action.selectedGame.opponentUid
          : action.selectedGame.challengerUid
      let opponentName = imChallenger ? action.selectedGame.opponentName
        : action.selectedGame.challengerName
      let opponentUid = imChallenger ? action.selectedGame.opponentUid
          : action.selectedGame.challengerUid
      let spectator = opponentUid !== state.myUid &&
        playerUid !== state.myUid

      // fresh history
      const chessState = new ChessRules()
      // chessState.init()
      const chessStateHistory = [chessState]

      // new game
      return Object.assign({}, state, {
        focusRow: -1,
        focusCol: -1,
        visualIndex: 0,
        actualIndex: 0,
        playerName: playerName,
        playerUid: playerUid,
        opponentName: opponentName,
        opponentUid: opponentUid,
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
