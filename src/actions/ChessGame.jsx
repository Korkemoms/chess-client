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
