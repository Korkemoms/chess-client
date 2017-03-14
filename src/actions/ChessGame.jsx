import ChessRules from '../components/ChessRules'

export const setFocus = (focusRow, focusCol) => {
  return {
    type: 'SET_FOCUS',
    focusRow: focusRow,
    focusCol: focusCol
  }
}

export const setVisualIndex = index => {
  return {
    type: 'SET_VISUAL_INDEX',
    visualIndex: index
  }
}

export const _sendMove = move => {
  return {
    type: 'SEND_MOVE',
    move: move
  }
}

export const setActualIndex = index => {
  return {
    type: 'SET_ACTUAL_INDEX',
    actualIndex: index
  }
}

export const setDisplayConfirmation = displayConfirmation => {
  return {
    type: 'SET_DISPLAY_CONFIRMATION',
    displayConfirmation: displayConfirmation
  }
}

export const setChessStateHistory = chessStateHistory => {
  return {
    type: 'SET_CHESS_STATE_HISTORY',
    chessStateHistory: chessStateHistory
  }
}
export const sendMovesFailed = message => {
  return {
    type: 'SEND_MOVES_FAILED',
    message: message
  }
}
export const clearChessGame = () => {
  return {
    type: 'CLEAR_CHESS_GAME'
  }
}

export const actuallyMove = confirmed => (dispatch, getState) => {
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

  // do it
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

    dispatch(move(focusRow, focusCol, row, col, lastMoveNumber + 1,
      false, state.actualIndex, state.visualIndex, state.chessStateHistory))
  }
}

/**
 * Perform many moves
 * @param moves
 * @returns the chess state after the moves
 */
export const initWithMoves = (moves, actual) => dispatch => {
  if (moves.length === 0) return

  let index = 0

  let chessState = new ChessRules()
  chessState.init()
  const newHistory = []
  newHistory.push(chessState)

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

  dispatch(setChessStateHistory(newHistory))
  dispatch(setVisualIndex(index))
  if (actual) {
    dispatch(setActualIndex(index))
  }
  dispatch(setFocus(-1, -1))

  return chessState
}

/**
 * Perform many moves
 * @param moves
 * @returns the chess state after the moves
 */
export const moveMany = (moves, actual) => (dispatch, getState) => {
  if (moves.length === 0) return

  let state = getState().chessGame

  let index = actual ? state.actualIndex : state.visualIndex
  let chessState = state.chessStateHistory[index]
  const newHistory = state.chessStateHistory.slice(0, index + 1)

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
      throw Error(`Wrong move number. Actual:${number} Expected:${lastMoveNumber + 1}`)
    }
  })

  dispatch(setChessStateHistory(newHistory))
  dispatch(setVisualIndex(index))
  if (actual) {
    dispatch(setActualIndex(index))
  }
  dispatch(setFocus(-1, -1))

  return chessState
}

/**
 * Move one piece
 * @param number move number, to avoid performing the same move twice.
 * @param actual whether to actually move the piece
 * @returns state the chess state after the moves
 */
export const move = (fromRow, fromCol, toRow, toCol, number,
  actual) => (dispatch, getState) => {
    let state = getState().chessGame

    number = Number(number)

    const index = actual ? state.actualIndex : state.visualIndex
    const chessState = state.chessStateHistory[index]

    let lastMoveNumber = chessState.moves.length > 0
    ? chessState.moves[chessState.moves.length - 1].number : 0

    if (number !== lastMoveNumber + 1) {
      console.log('Duplicate move (' + number + '), ignoring')
      return null
    }

    const newRuleState = chessState.move(fromRow, fromCol, toRow, toCol)

    const newHistory = state.chessStateHistory.slice(0, index + 1)
    newHistory.push(newRuleState)

    dispatch(setChessStateHistory(newHistory))
    dispatch(setVisualIndex(index + 1))
    if (actual) {
      dispatch(setActualIndex(state.actualIndex + 1))
    }

    dispatch(setFocus(-1, -1))

    return newRuleState
  }

export const sendMove = (move, callback) => (dispatch, getState) => {
  dispatch(_sendMove(move))

  let form = new FormData()
  form.append('from_row', move.fromRow)
  form.append('from_col', move.fromCol)
  form.append('to_row', move.toRow)
  form.append('to_col', move.toCol)
  form.append('number', move.number)
  form.append('number', move.number)
  form.append('chess_game_id', move.chessGameId)

  return getState().chessGame.myFetch('/chess-moves', {
    method: 'POST',
    body: form
  }, callback)
  .catch(error => { // handle errors
    dispatch(sendMovesFailed('Something went wrong: ' + error))
  })
}
