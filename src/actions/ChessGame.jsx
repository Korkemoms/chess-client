// @flow
import ChessRules from '../components/ChessRules'
import type { Action, Move } from './Types'
import { ActionTypes } from './Types'

/** Normal action */
export const setFocus = (focusRow, focusCol): Action => {
  return {
    type: ActionTypes.SET_FOCUS,
    payload: {
      focusRow: focusRow,
      focusCol: focusCol
    }
  }
}

/** Normal action */
export const _sendMove = (move: Move): Action => {
  return {
    type: ActionTypes.SEND_MOVE,
    payload: move
  }
}

/** Normal action */
export const setVisualIndex = (index: number): Action => {
  return {
    type: ActionTypes.SET_VISUAL_INDEX,
    payload: index
  }
}

/** Normal action */
export const setActualIndex = (index: number): Action => {
  return {
    type: ActionTypes.SET_ACTUAL_INDEX,
    payload: index
  }
}

/** Normal action */
export const setDisplayConfirmation = (displayConfirmation: boolean): Action => {
  return {
    type: ActionTypes.SET_DISPLAY_CONFIRMATION,
    payload: displayConfirmation
  }
}

/** Normal action */
export const setChessStateHistory = (chessStateHistory: Array<Object>): Action => {
  return {
    type: ActionTypes.SET_CHESS_STATE_HISTORY,
    payload: chessStateHistory
  }
}

/** Normal action */
export const sendMovesFailed = (message: string): Action => {
  return {
    type: ActionTypes.SEND_MOVES_FAILED,
    payload: message
  }
}

/** Normal action */
export const clearChessGame = (): Action => {
  return {
    type: ActionTypes.CLEAR_CHESS_GAME
  }
}

/**
 * Thunk action
 * Actually move a piece if confirmed.
 * This means moving the piece like normal but also updating the
 * 'actual index' and sending the move to the server.
 * If not confirmed this method makes confirmation buttons appear.
 *
 * Nothing is done directly by this method
 * instead appropriate 'real' actions are dispatched.
 *
 * @param {boolean} confirmed Whether the move is confirmed
 */
export const actuallyMove = (confirmed: boolean) => (dispatch: Function, getState: Function) => {
  let state = getState().chessGame
  if (confirmed) {
    const chessState = state.chessStateHistory[state.actualIndex + 1]
    const lastMove = chessState.moves[chessState.moves.length - 1].copy()

    let visualIndex = state.actualIndex + 1

    let move = {
      chessGameId: state.gameId,
      ...lastMove
    }

    dispatch(setDisplayConfirmation(false))
    dispatch(setActualIndex(visualIndex))
    dispatch(setVisualIndex(visualIndex))
    dispatch(sendMove(move, result => {
      if (result.status !== 'ok') {
        console.war('Server did not accept move', move)
      }
    }))
  } else {
    dispatch(setDisplayConfirmation(true))
  }
}

/**
 * Thunk action
 * Determines what to do when a square on the board is clicked,
 * then appropriate actions are dispatched.
 *
 * Nothing is done directly by this method
 * instead appropriate 'real' actions are dispatched.
 * @param {number} row 1-8, the labels on the board are in opposite order (8-1)
 * @param {number} col 1-8, the labels on the board are in opposite order (h-a)
 */
export const handleClick = (row, col) => (dispatch, getState) => {
  // gather some info

  let state = getState().chessGame

  const visualIndex = state.visualIndex
  const chessState = state.chessStateHistory[visualIndex]
  const focusRow = state.focusRow
  const focusCol = state.focusCol
  const gotFocus = focusRow !== -1 && focusCol !== -1
  const haveOpponent = state.opponentName !== null
  const future = state.visualIndex >= state.actualIndex

  // determine what to do
  const focusPiece = gotFocus ? chessState.getPiece(focusRow, focusCol) : null
  const clickedPiece = chessState.getPiece(row, col)
  const focusColor = focusPiece !== null ? focusPiece.color : ''

  let shouldSetFocus = !clickedPiece.isEmpty() && !gotFocus &&
    clickedPiece.color === chessState.whoseTurn && future

  let shouldUnFocus = gotFocus && focusRow === row &&
    focusCol === col && future

  let shouldMove = focusColor === chessState.whoseTurn && gotFocus &&
    chessState.canMove(focusRow, focusCol, row, col) && haveOpponent && future

  // update redux store
  if (shouldSetFocus) { // lift up the piece
    const newHistory = state.chessStateHistory.slice()

    dispatch(setChessStateHistory(newHistory))
    dispatch(setFocus(row, col))
  } else if (shouldUnFocus) { // put the piece back
    const newHistory = state.chessStateHistory.slice()

    dispatch(setChessStateHistory(newHistory))
    dispatch(setFocus(-1, -1))
  } else if (shouldMove) { // move the piece
    let lastMoveNumber = chessState.moves.length > 0
    ? chessState.moves[chessState.moves.length - 1].number : 0

    dispatch(move(focusRow, focusCol, row, col, lastMoveNumber + 1, false))
  }
}

/**
 * Thunk action
 * Apply 1 move. Nothing is done directly by this method
 * instead appropriate 'real' actions are dispatched.
 * @param {boolean} actual Whether to also update the 'actual index'
 * @param {number} number The move number, it is used to prevent 'duplicate' moves.
 * @returns the chess state after the moves
 */
export const move = (fromRow, fromCol, toRow, toCol, number, actual) => (dispatch, getState) => {
  let state = getState().chessGame

  const index = actual ? state.actualIndex : state.visualIndex
  const chessState = state.chessStateHistory[index]

  // verify move number
  number = Number(number)
  let lastMoveNumber = chessState.moves.length > 0
  ? chessState.moves[chessState.moves.length - 1].number : 0
  if (number !== lastMoveNumber + 1) {
    console.log('Duplicate move (' + number + '), ignoring')
    return null
  }

  // add a new chess rule state to history
  const newRuleState = chessState.move(fromRow, fromCol, toRow, toCol)
  const newHistory = state.chessStateHistory.slice(0, index + 1)
  newHistory.push(newRuleState)

  // update redux store
  dispatch(setChessStateHistory(newHistory))
  dispatch(setVisualIndex(index + 1))
  if (actual) {
    dispatch(setActualIndex(state.actualIndex + 1))
  }

  dispatch(setFocus(-1, -1))

  return newRuleState
}

/**
 * Thunk action
 * Init the game with 0 or more moves. Nothing is done directly by this method
 * instead appropriate 'real' actions are dispatched.
 * @param {Array} moves The moves to be performed
 * @param {boolean} actual Whether to also update the 'actual index'
 * @returns the chess state after the moves
 */
export const initWithMoves = (moves: Array<Move>, actual) => dispatch => {
  if (moves.length === 0) return

  let index = 0

  let chessState = new ChessRules()
  // chessState.init()
  const newHistory = []
  newHistory.push(chessState)

  // add new chess rule states to history
  let lastMoveNumber = chessState.moves.length > 0
  ? chessState.moves[chessState.moves.length - 1].number : 0

  moves = moves.sort((a, b) => a.number - b.number)
  moves.forEach(function (move) {
    let number = Number(move.number)
    if (number === lastMoveNumber + 1) {
      chessState = chessState.move(move.fromRow, move.fromCol, move.toRow, move.toCol)
      newHistory.push(chessState)
      index++
      lastMoveNumber++
    } else {
      console.log('Duplicate move (' + number + '), ignoring')
    }
  })

  // update redux store
  dispatch(setChessStateHistory(newHistory))
  dispatch(setVisualIndex(index))
  if (actual) {
    dispatch(setActualIndex(index))
  }
  dispatch(setFocus(-1, -1))

  return chessState
}

/**
 * Thunk action
 * Apply 0 or more moves. Nothing is done directly by this method
 * instead appropriate 'real' actions are dispatched.
 * @param {Array} moves The moves to be performed
 * @param {boolean} actual Whether to also update the 'actual index'
 * @returns the chess state after the moves
 */
export const moveMany = (moves: Array<Move>, actual: bool) => (dispatch, getState) => {
  if (moves.length === 0) return

  let state = getState().chessGame
  let somethingHappened = false

  let index = actual ? state.actualIndex : state.visualIndex
  let chessState = state.chessStateHistory[index]
  const newHistory = state.chessStateHistory.slice(0, index + 1)

  // add new chess rule states to history
  let lastMoveNumber = chessState.moves.length > 0
  ? chessState.moves[chessState.moves.length - 1].number : 0

  moves = moves.sort((a, b) => a.number - b.number)
  moves.forEach(function (move) {
    let number = Number(move.number)
    if (number === lastMoveNumber + 1) {
      chessState = chessState.move(move.fromRow, move.fromCol, move.toRow, move.toCol)
      newHistory.push(chessState)
      index++
      lastMoveNumber++
      somethingHappened = true
    } else {
      console.log(`Ignoring move: Wrong move number. Actual:${number} Expected:${lastMoveNumber + 1}`)
    }
  })

  // update components
  if (somethingHappened) {
    dispatch(setChessStateHistory(newHistory))
    dispatch(setVisualIndex(index))
    if (actual) {
      dispatch(setActualIndex(index))
    }
    dispatch(setFocus(-1, -1))
  }

  return chessState
}

/**
 * Thunk action
 * Send a move to the server.
 * @param {Move} move the move to send
 * @param {callback} callback the response from the API
 */
export const sendMove = (move: Move, callback) => (dispatch, getState) => {
  dispatch(_sendMove(move))

  let body = {
    'from_row': move.fromRow,
    'from_col': move.fromCol,
    'to_row': move.toRow,
    'to_col': move.toCol,
    'number': move.number,
    'chess_game_id': move.chessGameId
  }

  return getState().chessGame.myFetch('/chess-moves', {
    method: 'POST',
    body: JSON.stringify(body)
  }, callback)
  .catch(error => { // handle errors
    dispatch(sendMovesFailed('Something went wrong: ' + error))
  })
}
