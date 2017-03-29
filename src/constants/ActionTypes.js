/**
 * Action types should be fetched using a function call.
 * This causes an error to be thrown if non existing
 * types are used. (instead of silently causing a bug)
 */
export const types = {
  app: {
    APP_RECEIVE_PROPS: () => 'APP_RECEIVE_PROPS'
  },
  chessGame: {
    SET_FOCUS: () => 'SET_FOCUS',
    SET_VISUAL_INDEX: () => 'SET_VISUAL_INDEX',
    SEND_MOVE: () => 'SEND_MOVE',
    SET_ACTUAL_INDEX: () => 'SET_ACTUAL_INDEX',
    SET_DISPLAY_CONFIRMATION: () => 'SET_DISPLAY_CONFIRMATION',
    SET_CHESS_STATE_HISTORY: () => 'SET_CHESS_STATE_HISTORY',
    SEND_MOVES_FAILED: () => 'SEND_MOVES_FAILED',
    CLEAR_CHESS_GAME: () => 'CLEAR_CHESS_GAME'
  },
  lobby: {
    RECEIVE_PLAYERS: () => 'RECEIVE_PLAYERS',
    RECEIVE_CHESS_GAMES: () => 'RECEIVE_CHESS_GAMES',
    RECEIVE_CHESS_MOVES: () => 'RECEIVE_CHESS_MOVES',
    RECEIVE_UPDATES: () => 'RECEIVE_UPDATES',
    SELECT_PLAYER: () => 'SELECT_PLAYER',
    SELECT_GAME: () => 'SELECT_GAME',
    EXPAND_GAME: () => 'EXPAND_GAME',
    CHALLENGE_PLAYER: () => 'CHALLENGE_PLAYER',
    CHALLENGE_PLAYER_FAILED: () => 'CHALLENGE_PLAYER_FAILED',
    REQUEST_UPDATES_FAILED: () => 'REQUEST_UPDATES_FAILED',
    REQUEST_UPDATES: () => 'REQUEST_UPDATES',
    SELECT_TAB: () => 'SELECT_TAB'
  }
}
