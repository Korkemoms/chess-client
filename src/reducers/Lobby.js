// @flow
import type { Action } from '../actions/Types'
import { ActionTypes } from '../actions/Types'

export type State = {
  players: Array<Object>,
  chessGames: Array<Object>,
  chessMoves: Object,
  updateIndex: number,
  playerUid: ?string,
  playerName: ?string,
  selectedGame: ?Object,
  selectedPlayer: ?Object,
  previousSelectedPlayer: ?Object,
  expandedGame: ?Object,
  previousExpandedGame: ?Object,
  selectedTab: string,
}

const initialState = {
  players: [],
  chessGames: [],
  chessMoves: {},
  updateIndex: -1,
  playerUid: null,
  playerName: null,
  selectedGame: null,
  selectedPlayer: null,
  previousSelectedPlayer: null,
  expandedGame: null,
  previousExpandedGame: null,
  selectedTab: 'players'
}

export default function update (state: State = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_PLAYERS: {
      let current = state.players // its not copied!
      let updated = action.payload

      // remove from current any that also is in updated
      current = current.filter(currentPlayer =>
         !updated.some(updatedPlayer => {
           return updatedPlayer.id === currentPlayer.id
         }))

      // get the last update index (will be used in the next query)
      let updateIndex = state.updateIndex
      updated.forEach(player => {
        if (player.updateIndex > updateIndex) {
          updateIndex = player.updateIndex
        }
      })
      let players = current.concat(updated)

      return Object.assign({}, state, {
        players: players,
        updateIndex: updateIndex // if there is change the update index will change
      })
    }

    case ActionTypes.SELECT_TAB: {
      return Object.assign({}, state, {
        selectedTab: action.payload
      })
    }

    case ActionTypes.RECEIVE_CHESS_GAMES: {
      let current = state.chessGames // its not copied!
      let updated = action.payload

      // remove from current any that also is in updated
      current = current.filter(currentChessGame =>
         !updated.some(updatedChessGame => {
           return updatedChessGame.id === currentChessGame.id
         }))

      // get the last update index (will be used in the next query)
      let updateIndex = state.updateIndex
      updated.forEach(chessGame => {
        if (chessGame.updateIndex > updateIndex) {
          updateIndex = chessGame.updateIndex
        }
      })
      let chessGames = current.concat(updated)

      return Object.assign({}, state, {
        chessGames: chessGames,
        updateIndex: updateIndex // if there is change the update index will change
      })
    }

    case ActionTypes.RECEIVE_CHESS_MOVES: {
      let local = state.chessMoves // careful, it not copied

      // store the moves in one object per chess game
      let updateIndex = state.updateIndex
      action.payload.forEach(chessMove => {
        if (!(chessMove.chessGameId in local)) {
          local[chessMove.chessGameId] = {}
        }
        local[chessMove.chessGameId][chessMove.id] = chessMove

        if (chessMove.updateIndex > updateIndex) {
          updateIndex = chessMove.updateIndex
        }
      })

      return Object.assign({}, state, {
        chessMoves: local,
        updateIndex: updateIndex // if there is change the update index will change
      })
    }

    case ActionTypes.SELECT_PLAYER: {
      let previousSelectedPlayer = state.selectedPlayer
      return Object.assign({}, state, {
        previousSelectedPlayer,
        selectedPlayer: action.payload
      })
    }

    case ActionTypes.EXPAND_GAME: {
      let previousExpandedGame = state.expandedGame
      return Object.assign({}, state, {
        expandedGame: action.payload,
        previousExpandedGame
      })
    }

    case ActionTypes.SELECT_GAME:
      return Object.assign({}, state, {
        selectedGame: action.payload
      })

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
