// @flow
import type { Action } from '../actions/Types'
import { ActionTypes } from '../actions/Types'
import ChessRules from '../components/ChessRules'

export type State = {
  focusRow: number,
  focusCol: number,
  visualIndex: number,
  actualIndex: number,
  gameId: ?number,
  displayConfirmation: ?bool,
  chessStateHistory: Array,
  whitePlayerUid: ?string,
  whitePlayerName: ?string,
  blackPlayerUid: ?string,
  blackPlayerName: ?string,
  playerUid: ?string,
  playerName: ?string,
  myColor: ?string,
  spectator: bool,
  myFetch: ?Function
}

const initialState = {
  focusRow: -1,
  focusCol: -1,
  visualIndex: 0,
  actualIndex: 0,
  gameId: null,
  displayConfirmation: false,
  chessStateHistory: [new ChessRules()],
  whitePlayerUid: null,
  whitePlayerName: 'Player1',
  blackPlayerUid: null,
  blackPlayerName: 'Player2',
  playerUid: null,
  playerName: null,
  myColor: 'White',
  spectator: true,
  myFetch: null
}

const update = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_FOCUS:
      return Object.assign({}, state, {
        focusRow: action.payload.focusRow,
        focusCol: action.payload.focusCol
      })
    case ActionTypes.SET_VISUAL_INDEX:
      return Object.assign({}, state, {
        visualIndex: action.payload
      })
    case ActionTypes.SET_ACTUAL_INDEX:
      return Object.assign({}, state, {
        actualIndex: action.payload
      })
    case ActionTypes.SET_DISPLAY_CONFIRMATION:
      return Object.assign({}, state, {
        displayConfirmation: action.payload
      })
    case ActionTypes.SET_CHESS_STATE_HISTORY:
      return Object.assign({}, state, {
        chessStateHistory: action.payload
      })
    case ActionTypes.CLEAR_CHESS_GAME: {
      // reset most of the state
      let playerName = state.playerName
      let playerUid = state.playerUid
      let myFetch = state.myFetch

      return {
        ...initialState,
        playerName,
        playerUid,
        myFetch
      }
    }
    case ActionTypes.RECEIVE_CHESS_GAMES: {
      // determine if we receive info about current game (same id)
      let received
      Object.values(action.payload).forEach(game => {
        if (game.id === state.gameId) {
          received = game
        }
      })

      if (!received) {
        return Object.assign({}, state)
      }

      let spectator = received.whitePlayerUid !== state.playerUid &&
        received.blackPlayerUid !== state.playerUid

      // update current game
      return Object.assign({}, state, {
        whitePlayerName: received.whitePlayerName,
        whitePlayerUid: received.whitePlayerUid,
        blackPlayerName: received.blackPlayerName,
        blackPlayerUid: received.blackPlayerUid,
        displayConfirmation: false,
        spectator: spectator
      })
    }
    case ActionTypes.SELECT_GAME: {
      // determine some values

      let selectedGame = action.payload.selectedGame
      let spectator = selectedGame.whitePlayerUid !== state.playerUid &&
        selectedGame.blackPlayerUid !== state.playerUid

      // new game
      return Object.assign({}, state, {
        focusRow: -1,
        focusCol: -1,
        visualIndex: 0,
        actualIndex: 0,
        chessStateHistory: [new ChessRules()],
        gameId: selectedGame.id,
        whitePlayerName: selectedGame.whitePlayerName,
        whitePlayerUid: selectedGame.whitePlayerUid,
        blackPlayerName: selectedGame.blackPlayerName,
        blackPlayerUid: selectedGame.blackPlayerUid,
        displayConfirmation: false,
        spectator: spectator
      })
    }

    case ActionTypes.APP_RECEIVE_PROPS: {
      return Object.assign({}, state, {
        ...initialState, // reset everything
        ...action.payload  // except this
      })
    }
    default:
      return state
  }
}

export default update
