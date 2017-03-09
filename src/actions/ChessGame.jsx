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

export const sendMove = (myFetch, move) => {
  return dispatch => {
    dispatch(_sendMove(move))

    var form = new FormData()
    form.append('from_row', move.fromRow)
    form.append('from_col', move.fromCol)
    form.append('to_row', move.toRow)
    form.append('to_col', move.toCol)
    form.append('number', move.number)

    return myFetch('/chess-moves', {
      method: 'POST',
      body: form
    })
    .catch(error => { // handle errors
      dispatch(sendMovesFailed('Something went wrong: ' + error))
    })
  }
}
