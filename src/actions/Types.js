// @flow

export const ActionTypes = {
  // ------------ app ------------
  APP_RECEIVE_PROPS: 'APP_RECEIVE_PROPS',
  // ------------ lobby ------------
  RECEIVE_PLAYERS: 'RECEIVE_PLAYERS',
  RECEIVE_CHESS_GAMES: 'RECEIVE_CHESS_GAMES',
  RECEIVE_CHESS_MOVES: 'RECEIVE_CHESS_MOVES',
  RECEIVE_UPDATES: 'RECEIVE_UPDATES',
  SELECT_PLAYER: 'SELECT_PLAYER',
  SELECT_GAME: 'SELECT_GAME',
  EXPAND_GAME: 'EXPAND_GAME',
  CHALLENGE_PLAYER: 'CHALLENGE_PLAYER',
  CHALLENGE_PLAYER_FAILED: 'CHALLENGE_PLAYER_FAILED',
  REQUEST_UPDATES_FAILED: 'REQUEST_UPDATES_FAILED',
  REQUEST_UPDATES: 'REQUEST_UPDATES',
  SELECT_TAB: 'SELECT_TAB',
  // ------------ chess game ------------
  SET_FOCUS: 'SET_FOCUS',
  SET_VISUAL_INDEX: 'SET_VISUAL_INDEX',
  SEND_MOVE: 'SEND_MOVE',
  SET_ACTUAL_INDEX: 'SET_ACTUAL_INDEX',
  SET_DISPLAY_CONFIRMATION: 'SET_DISPLAY_CONFIRMATION',
  SET_CHESS_STATE_HISTORY: 'SET_CHESS_STATE_HISTORY',
  SEND_MOVES_FAILED: 'SEND_MOVES_FAILED',
  CLEAR_CHESS_GAME: 'CLEAR_CHESS_GAME'
}

export type Game = {
  accepted: ?bool,
  blackPlayerName: ?string,
  blackPlayerUid: ?string,
  whitePlayerUid: ?string,
  whitePlayerUid: ?string,
  id: ?string,
  uid: ?string,
  updateIndex: ?string
}

export type Player = {
  email: ?string,
  name: string,
  signereUid: ?string,
  uid: string,
  updateIndex: number,
  updatedAt: ?Object
}

export type Move = {
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  number: number,
  chessGameId: number // The index of this move
}

// TODO improve Action types
/**
 * These are all the actions in this app.
 * The consequences of the actions are defined by the reducers.
 */
export type Action =
({
// ------------ chess game ------------
  type: 'SET_FOCUS',
  payload: {
    focusRow: number,
    focusRow: number
  }
} | {
  type: 'SET_VISUAL_INDEX',
  payload: number
} | {
  type: 'SEND_MOVE',
  payload: Move
} | {
  type: 'SET_ACTUAL_INDEX',
  payload: number
} | {
  type: 'SET_DISPLAY_CONFIRMATION',
  payload: bool
} | {
  type: 'SET_CHESS_STATE_HISTORY',
  payload: Array<Object>
} | {
  type: 'SEND_MOVES_FAILED'
} | {
  type: 'CLEAR_CHESS_GAME'
} | {
// ------------ app ------------
  type: 'APP_RECEIVE_PROPS',
  payload: Object
} | {
// ------------ lobby ------------
  type: 'RECEIVE_PLAYERS',
  payload: Array<Player>
} | {
  type: 'RECEIVE_CHESS_GAMES',
  payload: Array<Game>
} | {
  type: 'RECEIVE_CHESS_MOVES',
  payload: Array<Move>
} | {
  type: 'RECEIVE_CUPDATES',
  payload: Array<Object>
} | {
  type: 'SELECT_PLAYER',
  payload: Array<Player>
} | {
  type: 'SELECT_GAME',
  payload: Array<Game>
} | {
  type: 'EXPAND_GAME',
  payload: Array<Game>
} | {
  type: 'CHALLENGE_PLAYER',
  payload: Array<Player>
} | {
  type: 'CHALLENGE_PLAYER_FAILED'
} | {
  type: 'REQUEST_UPDATES',
  payload: number
} | {
  type: 'REQUEST_UPDATES_FAILED'
}| {
  type: 'SELECT_TAB',
  payload: string
})
