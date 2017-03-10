import ChessRules from '../components/ChessRules'

export const setFocus = (focusRow, focusCol) => {
  return {
    type: 'SET_FOCUS',
    focusRow: focusRow,
    focusCol: focusCol
  }
}

export const setVisualIndex = (index) => {
  return {
    type: 'SET_VISUAL_INDEX',
    visualIndex: index
  }
}

export const _sendMove = (move) => {
  return {
    type: 'SEND_MOVE',
    move: move
  }
}

export const setActualIndex = (index) => {
  return {
    type: 'SET_ACTUAL_INDEX',
    actualIndex: index
  }
}

export const setDisplayConfirmation = (displayConfirmation) => {
  return {
    type: 'SET_DISPLAY_CONFIRMATION',
    displayConfirmation: displayConfirmation
  }
}

export const setChessStateHistory = (chessStateHistory) => {
  return {
    type: 'SET_CHESS_STATE_HISTORY',
    chessStateHistory: chessStateHistory
  }
}
export const sendMovesFailed = (message) => {
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

export const actuallyMove = props => confirmed => dispatch => {
  if (confirmed) {
    const chessState = props.chessStateHistory[props.actualIndex + 1]
    const lastMove = chessState.moves[chessState.moves.length - 1].copy()

    let visualIndex = props.actualIndex + 1

    dispatch(setDisplayConfirmation(false))
    dispatch(setActualIndex(visualIndex))
    dispatch(setVisualIndex(visualIndex))

    let move = {
      chessGameId: props.gameId,
      ...lastMove
    }

    dispatch(sendMove(props.myFetch, move))
  } else {
    dispatch(setDisplayConfirmation(true))
  }
}

export const handleClick = props => (row, col) => dispatch => {
  // gather some info

  const visualIndex = props.visualIndex
  const chessState = props.chessStateHistory[visualIndex]
  const focusRow = props.focusRow
  const focusCol = props.focusCol
  const gotFocus = focusRow !== -1 && focusCol !== -1
  const haveOpponent = props.opponentName !== null
  const future = props.visualIndex >= props.actualIndex

  // determine what to do
  const focusPiece = gotFocus ? chessState.getPiece(focusRow, focusCol) : null
  const clickedPiece = chessState.getPiece(row, col)
  const focusColor = focusPiece !== null ? focusPiece.color : ''

  let setFocus = !clickedPiece.isEmpty() && !gotFocus &&
  clickedPiece.color === chessState.whoseTurn && future
  let unFocus = gotFocus && focusRow === row &&
    focusCol === col && future
  let move = focusColor === chessState.whoseTurn && gotFocus &&
    chessState.canMove(focusRow, focusCol, row, col) && haveOpponent && future

  // do it
  if (setFocus) { // lift up the piece
    const newHistory = props.chessStateHistory.slice()

    props.setChessStateHistory(newHistory)
    props.setFocus(row, col)
  } else if (unFocus) { // put the piece back
    const newHistory = props.chessStateHistory.slice()

    props.setChessStateHistory(newHistory)
    props.setFocus(-1, -1)
  } else if (move) { // move the piece
    let lastMoveNumber = chessState.moves.length > 0
    ? chessState.moves[chessState.moves.length - 1].number : 0

    props.move(focusRow, focusCol, row, col, lastMoveNumber + 1,
      false, props.actualIndex, props.visualIndex, props.chessStateHistory)
  }
}

/**
 * Perform many moves
 * @param moves
 * @returns the chess state after the moves
 */
export const initWithMoves = (moves, actual) => dispatch => {
  console.log(moves)
  if (moves.length === 0) return

  let index = 0

  let chessState = new ChessRules()
  chessState.init()
  const newHistory = []
  newHistory.push(chessState)

  let lastMoveNumber = chessState.moves.length > 0
  ? chessState.moves[chessState.moves.length - 1].number : 0

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
export const moveMany = props => (moves, actual) => dispatch => {
  console.log(moves)
  if (moves.length === 0) return

  let index = actual ? props.actualIndex : props.visualIndex
  let chessState = props.chessStateHistory[index]
  const newHistory = chessStateHistory.slice()

  let lastMoveNumber = chessState.moves.length > 0
  ? chessState.moves[chessState.moves.length - 1].number : 0

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

// TODO clean
/**
 * Move one piece
 * @param number move number, to avoid performing the same move twice.
 * @param actual whether to actually move the piece
 * @returns state the chess state after the moves
 */
export const move = props => (fromRow, fromCol, toRow, toCol, number,
  actual) => dispatch => {
    number = Number(number)

    const index = actual ? props.actualIndex : props.visualIndex
    const chessState = props.chessStateHistory[index]

    let lastMoveNumber = chessState.moves.length > 0
    ? chessState.moves[chessState.moves.length - 1].number : 0

    if (number !== lastMoveNumber + 1) {
      console.log('Duplicate move (' + number + '), ignoring')
      return null
    }

    const newRuleState = chessState.move(fromRow, fromCol, toRow, toCol)

    const newHistory = props.chessStateHistory.slice(0, index + 1)
    newHistory.push(newRuleState)

    dispatch(setChessStateHistory(newHistory))
    dispatch(setVisualIndex(index + 1))
    if (actual) {
      dispatch(setActualIndex(props.actualIndex + 1))
    }

    dispatch(setFocus(-1, -1))

    return newRuleState
  }

export const sendMove = (myFetch, move) => dispatch => {
  dispatch(_sendMove(move))

  var form = new FormData()
  form.append('from_row', move.fromRow)
  form.append('from_col', move.fromCol)
  form.append('to_row', move.toRow)
  form.append('to_col', move.toCol)
  form.append('number', move.number)
  form.append('number', move.number)
  form.append('chess_game_id', move.chessGameId)

  return myFetch('/chess-moves', {
    method: 'POST',
    body: form
  })
    .catch(error => { // handle errors
      dispatch(sendMovesFailed('Something went wrong: ' + error))
    })
}
