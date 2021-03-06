// @flow
// const index->rowLabels = '01234567'->'87654321';
// const index->colLabels = '01234567'->'abcdefgh';

// TODO limit move history length? (need only length two to implement en passant)
// TODO Use Immutable.js?

// unicode symbols
const wKing = '\u2654'
const wQueen = '\u2655'
const wRook = '\u2656'
const wBishop = '\u2657'
const wKnight = '\u2658'
const wPawn = '\u2659'

const bKing = '\u265A'
const bQueen = '\u265B'
const bRook = '\u265C'
const bBishop = '\u265D'
const bKnight = '\u265E'
const bPawn = '\u265F'

/** Should be treated as immutable */
class Piece {
  constructor (unicode, color, moves) {
    this.unicode = unicode
    this.color = color
    this.moves = moves // the number of times 'this' piece has been moved
  }

  copy () {
    return new Piece(this.unicode, this.color, this.moves)
  }

  isEmpty () {
    return this.unicode === ''
  }
}

/** The empty squares has a copy of this piece */
const emptyPiece = new Piece('', '', 0)

/** Should be treated as immutable */
class Move {
  constructor (fromRow, fromCol, targetRow, targetCol, number) {
    this.fromRow = fromRow
    this.fromCol = fromCol
    this.toRow = targetRow
    this.toCol = targetCol
    this.number = number // first move in a game is 1, next is 2 etc...
  }

  copy () {
    return new Move(this.fromRow, this.fromCol,
      this.toRow, this.toCol, this.number)
  }
}

/**
 * Chess rules, has a history in order to implement some rules.
 * White starts bottom (row 6 and 7)
 *
 * Should be treated as immutable
 */
export default class ChessRules {
  constructor () {
    this.pieces = []
    this.whoseTurn = 'White'
    this.deadPieces = []
    this.moves = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        this.pieces.push(emptyPiece.copy())
      }
    }

    // Black pieces
    let row = 0
    let col = 0
    this.pieces[col++ + (row * 8)] = new Piece(bRook, 'Black', 0)
    this.pieces[col++ + (row * 8)] = new Piece(bKnight, 'Black', 0)
    this.pieces[col++ + (row * 8)] = new Piece(bBishop, 'Black', 0)
    this.pieces[col++ + (row * 8)] = new Piece(bQueen, 'Black', 0)
    this.pieces[col++ + (row * 8)] = new Piece(bBishop, 'Black', 0)
    this.pieces[col++ + (row * 8)] = new Piece(bKing, 'Black', 0)
    this.pieces[col++ + (row * 8)] = new Piece(bKnight, 'Black', 0)
    this.pieces[col++ + (row * 8)] = new Piece(bRook, 'Black', 0)

    row = 1
    col = 0
    for (let i = 0; i < 8; i++) {
      this.pieces[col++ + (row * 8)] = new Piece(bPawn, 'Black', 0)
    }

    // White pieces
    row = 7
    col = 0
    this.pieces[col++ + (row * 8)] = new Piece(wRook, 'White', 0)
    this.pieces[col++ + (row * 8)] = new Piece(wKnight, 'White', 0)
    this.pieces[col++ + (row * 8)] = new Piece(wBishop, 'White', 0)
    this.pieces[col++ + (row * 8)] = new Piece(wQueen, 'White', 0)
    this.pieces[col++ + (row * 8)] = new Piece(wKing, 'White', 0)
    this.pieces[col++ + (row * 8)] = new Piece(wBishop, 'White', 0)
    this.pieces[col++ + (row * 8)] = new Piece(wKnight, 'White', 0)
    this.pieces[col++ + (row * 8)] = new Piece(wRook, 'White', 0)

    row = 6
    col = 0
    for (let i = 0; i < 8; i++) {
      this.pieces[col++ + (row * 8)] = new Piece(wPawn, 'White', 0)
    }
  }

  /** Get a complete copy of the state (copies history also) */
  copy () {
    const gameState = new ChessRules()

    // copy all positions (squares)
    const copyPositions = []
    for (let i = 0; i < this.pieces.length; i++) {
      copyPositions.push(this.pieces[i].copy())
    }
    gameState.pieces = copyPositions

    // copy dead pieces
    const copyDeadPieces = []
    for (let i = 0; i < this.deadPieces.length; i++) {
      copyDeadPieces.push(this.deadPieces[i].copy())
    }
    gameState.deadPieces = copyDeadPieces

    // copy move history
    const copyMoves = []
    for (let i = 0; i < this.moves.length; i++) {
      copyMoves.push(this.moves[i].copy())
    }
    gameState.moves = copyMoves

    // copy other stuff
    gameState.whoseTurn = this.whoseTurn

    return gameState
  }

  /** Get all the dead pieces so far with given color. */
  getDeadPieces (color) {
    const dead = []
    for (let i = 0; i < this.deadPieces.length; i++) {
      if (this.deadPieces[i].color === color) {
        dead.push(this.deadPieces[i].copy())
      }
    }
    return dead
  }
  /** Get the piece at this square, see top of doc for translation of index to labels */
  getPiece (row, col) {
    if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
    if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)

    return this.pieces[col + (row * 8)]
  }

  /**
   * Move a piece, returns a new ChessRules
   * assumes it is a valid move, see canMove(row,col,targetRow,targetCol)
   *
   * @returns a copy of this ChessRules where the given move has been performed
   */
  move (row, col, targetRow, targetCol) {
    row = Number(row)
    col = Number(col)
    targetRow = Number(targetRow)
    targetCol = Number(targetCol)

    const newState = this.copy()

    const enPassant = this.canEnPassant(row, col, targetRow, targetCol)
    const castling = this.canCastling(row, col, targetRow, targetCol)
    const killedPieceRow = enPassant ? row : targetRow
    const targetPiece = newState.pieces[targetCol + (killedPieceRow * 8)]

    if (!targetPiece.isEmpty()) {
      newState.deadPieces.push(targetPiece.copy())
    }

    // record the move
    newState.moves.push(new Move(row, col, targetRow, targetCol, newState.moves.length + 1))

    // 'move' the piece
    newState.pieces[targetCol + (targetRow * 8)] = this.pieces[col + (row * 8)].copy()
    newState.pieces[col + (row * 8)] = emptyPiece.copy()
    if (enPassant) {
      newState.pieces[targetCol + (killedPieceRow * 8)] = emptyPiece.copy()
    }
    if (castling) {
      // move rook over king
      if (targetCol === 6) {
        newState.pieces[5 + (targetRow * 8)] = newState.pieces[7 + (targetRow * 8)].copy()
        newState.pieces[7 + (targetRow * 8)] = emptyPiece.copy()
      }
      if (targetCol === 1) {
        newState.pieces[2 + (targetRow * 8)] = newState.pieces[0 + (targetRow * 8)].copy()
        newState.pieces[0 + (targetRow * 8)] = emptyPiece.copy()
      }
    }

    // upgrade pawns that make it across
    const unicode = newState.pieces[targetCol + (targetRow * 8)].unicode
    if (unicode === wPawn && targetRow === 0) {
      newState.pieces[targetCol + (targetRow * 8)].unicode = wQueen
    } else if (unicode === bPawn && targetRow === 7) {
      newState.pieces[targetCol + (targetRow * 8)].unicode = bQueen
    }

    // record how many times it has been moved
    newState.pieces[targetCol + (targetRow * 8)].moves++

    newState.whoseTurn = newState.whoseTurn === 'White' ? 'Black' : 'White'

    return newState
  }

  /**
   * Move a piece, returns a new ChessRules
   * does not account for special behavior (en passant and castling)
   * assumes it is a valid move otherwise, see canMove(row,col,targetRow,targetCol)
   *
   * @returns a copy of this ChessRules where the given move has been performed
   */
  basicMove (row, col, targetRow, targetCol) {
    const newState = this.copy()

    const targetPiece = newState.pieces[targetCol + (targetRow * 8)]

    if (!targetPiece.isEmpty()) {
      newState.deadPieces.push(targetPiece.copy())
    }

    // record the move
    newState.moves.push(new Move(row, col, targetRow, targetCol, newState.moves.length + 1))

    // 'move' the piece
    newState.pieces[targetCol + (targetRow * 8)] = this.pieces[col + (row * 8)].copy()
    newState.pieces[col + (row * 8)] = emptyPiece.copy()

    // record how many times it has been moved
    newState.pieces[targetCol + (targetRow * 8)].moves++

    newState.whoseTurn = newState.whoseTurn === 'White' ? 'Black' : 'White'

    return newState
  }

  /**
   * @returns whether Black king is in check
   */
  blackCheck () {
    // determine where Black king is
    let BlackKingRow = 0
    let BlackKingCol = 0

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.pieces[col + (row * 8)].unicode === bKing) {
          BlackKingRow = row
          BlackKingCol = col
          break
        }
      }
    }

    // see if any enemy is attacking the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const thisPiece = this.pieces[col + (row * 8)]
        if (thisPiece.color !== 'White') continue

        const canMove = this.basicCanMove(row, col, BlackKingRow, BlackKingCol)
        if (canMove) return true
      }
    }

    return false
  }

  /**
   * @returns whether White king is in check
   */
  whiteCheck () {
    // determine where White king is
    let WhiteKingRow = 0
    let WhiteKingCol = 0

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.pieces[col + (row * 8)].unicode === wKing) {
          WhiteKingRow = row
          WhiteKingCol = col
          break
        }
      }
    }

    // see if any enemy is attacking the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const thisPiece = this.pieces[col + (row * 8)]
        if (thisPiece.color !== 'Black') continue

        const canMove = this.basicCanMove(row, col, WhiteKingRow, WhiteKingCol)
        if (canMove) return true
      }
    }

    return false
  }

  /**
   * Also covers check, en passant and castling
   * @returns whether given move is allowed
   */
  canMove (row, col, targetRow, targetCol) {
    if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
    if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)
    if (targetRow < 0 || targetRow > 7) throw new Error('Illegal targetRow: ' + targetRow)
    if (targetCol < 0 || targetCol > 7) throw new Error('Illegal targetCol: ' + targetCol)
    if (targetRow === row && targetCol === col) return false // cannot move piece on itself

    const piece = this.pieces[col + (row * 8)]
    if (piece.color !== this.whoseTurn) return false // must be my turn

    const basicCanMove = this.basicCanMove(row, col, targetRow, targetCol)
    const canEnPassant = this.canEnPassant(row, col, targetRow, targetCol)
    const canCastling = this.canCastling(row, col, targetRow, targetCol)
    if (!basicCanMove && !canEnPassant && !canCastling) return false

    // copy state
    const stateCopy = this.copy()

    // update the copied state
    stateCopy.pieces[targetCol + (targetRow * 8)] = piece.copy()
    stateCopy.pieces[col + (row * 8)] = emptyPiece.copy()

    // is my king in check after this move ?
    if (piece.color === 'White' && stateCopy.whiteCheck()) return false
    if (piece.color === 'Black' && stateCopy.blackCheck()) return false

    return true
  }

  /**
   * @returns whether given move is a castling move and is allowed
   */
  canCastling (row, col, targetRow, targetCol) {
    function castlingRules (state, row, col, targetRow, targetCol) {
      if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
      if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)
      if (targetRow < 0 || targetRow > 7) throw new Error('Illegal targetRow: ' + targetRow)
      if (targetCol < 0 || targetCol > 7) throw new Error('Illegal targetCol: ' + targetCol)
      if (targetRow === row && targetCol === col) return false

      const piece = state.pieces[col + (row * 8)]
      const targetPiece = state.pieces[targetCol + (targetRow * 8)]

      if (piece === null) throw new Error('Cannot be null!!')
      if (piece.unicode === '') return false // cannot move empty piece
      if (piece.color !== state.whoseTurn) return false // must be my turn
      if (targetPiece.color !== piece.color) return false // target must be on my own team

      // Must be king and rook
      let correctPieces = piece.unicode === wRook && targetPiece.unicode === wKing
      correctPieces |= piece.unicode === wKing && targetPiece.unicode === wRook
      correctPieces |= piece.unicode === bRook && targetPiece.unicode === bKing
      correctPieces |= piece.unicode === bKing && targetPiece.unicode === bRook
      if (!correctPieces) return false

      // The king and rook involved in castling must not have previously moved
      if (piece.moves !== 0 || targetPiece.moves !== 0) return false
      if (row !== targetRow) return false // redundant

      // There must be no pieces between the king and the rook
      let leftCol = col < targetCol ? col : targetCol
      let rightCol = col > targetCol ? col : targetCol
      for (let i = leftCol + 1; i < rightCol; i++) {
        if (state.pieces[i + (row * 8)].unicode !== '') {
          return false
        }
      }

      const king = (piece.unicode === wKing || piece.unicode === bKing) ? piece : targetPiece
      const rook = piece === king ? targetPiece : piece
      const kingColumn = state.pieces[col + (row * 8)] === king ? col : targetCol
      const rookColumn = state.pieces[col + (row * 8)] === rook ? col : targetCol
      const kingDir = (kingColumn <= col && kingColumn <= targetCol) ? 1 : -1 // 1 right -1 left

      // The king may not currently be in check, nor may the king pass through or end up in a square that is under attack by an enemy piece
      // (though the rook is permitted to be under attack and to pass over an attacked square)
      if (king.unicode === wKing && state.whiteCheck()) return false
      if (king.unicode === bKing && state.blackCheck()) return false
      for (let i = kingColumn + kingDir; i !== rookColumn; i += kingDir) {
        const newState = state.basicMove(row, kingColumn, row, i) // makes a copy
        if (piece.color === 'white' && newState.whiteCheck()) return false
        if (piece.color === 'black' && newState.blackCheck()) return false
      }
      return true
    }

    if (row === 7 && col === 4 && targetRow === 7 && targetCol === 6) { if (castlingRules(this, 7, 4, 7, 7)) return true }
    if (row === 7 && col === 4 && targetRow === 7 && targetCol === 1) {
      if (castlingRules(this, 7, 4, 7, 0)) return true
    }

    if (row === 0 && col === 4 && targetRow === 0 && targetCol === 6) {
      if (castlingRules(this, 0, 4, 0, 7)) return true
    }
    if (row === 0 && col === 4 && targetRow === 0 && targetCol === 1) {
      if (castlingRules(this, 0, 4, 0, 0)) return true
    }

    return false
  }

  /**
   * @returns whether given move is a en passant move and is allowed
   */
  canEnPassant (row, col, targetRow, targetCol) {
    if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
    if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)
    if (targetRow < 0 || targetRow > 7) throw new Error('Illegal targetRow: ' + targetRow)
    if (targetCol < 0 || targetCol > 7) throw new Error('Illegal targetCol: ' + targetCol)
    if (targetRow === row && targetCol === col) return false

    const piece = this.pieces[col + (row * 8)]
    const targetPiece = this.pieces[targetCol + (targetRow * 8)]

    if (piece === null) throw new Error('Cannot be null!!')
    if (piece.unicode === '') return false // cannot move empty piece
    if (piece.color !== this.whoseTurn) return false // must be my turn
    if (targetPiece.color === piece.color) return false // target must not be on my own team

    const unicode = piece.unicode
    const lastMove = this.moves.length > 0 ? this.moves[this.moves.length - 1] : null
    const verticalDistanceLastMove = lastMove !== null ? Math.abs(lastMove.fromRow - lastMove.toRow) : null

    function enPassantRules (state, unicode) {
      let leftCheck,
        rightCheck

      if (unicode === wPawn) {
        // check for 'En passant' (white is bottom)
        const rowCheck = targetRow === row - 1
        rightCheck = targetCol === col + 1 &&
          state.pieces[targetCol + (row * 8)].unicode === bPawn

        rightCheck &= lastMove !== null && verticalDistanceLastMove === 2 &&
          lastMove.fromCol === targetCol && lastMove.toRow === row

        leftCheck = targetCol === col - 1 &&
          state.pieces[targetCol + (row * 8)].unicode === bPawn

        leftCheck &= lastMove !== null && verticalDistanceLastMove === 2 &&
          lastMove.fromCol === targetCol && lastMove.toRow === row

        if (rowCheck && (leftCheck || rightCheck)) return true
      }
      if (unicode === bPawn) {
        // check for 'En passant' (white is bottom)
        const rowCheck = targetRow === row + 1
        rightCheck = targetCol === col + 1 &&
          state.pieces[targetCol + (row * 8)].unicode === wPawn

        rightCheck &= lastMove !== null && verticalDistanceLastMove === 2 && lastMove.fromCol === targetCol && lastMove.toRow === row

        leftCheck = targetCol === col - 1 &&
          state.pieces[targetCol + (row * 8)].unicode === wPawn

        leftCheck &= lastMove !== null && verticalDistanceLastMove === 2 &&
          lastMove.fromCol === targetCol && lastMove.toRow === row

        if (rowCheck && (leftCheck || rightCheck)) return true
      }

      return false
    }

    if (unicode === wPawn || unicode === bPawn) {
      if (enPassantRules(this, unicode)) return true
    }
    return false
  }

  /**
   * only covers basic movements, does not care whose turn it is
   * @returns whether given move is allowed
   */
  basicCanMove (row, col, targetRow, targetCol) {
    if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
    if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)
    if (targetRow < 0 || targetRow > 7) throw new Error('Illegal targetRow: ' + targetRow)
    if (targetCol < 0 || targetCol > 7) throw new Error('Illegal targetCol: ' + targetCol)
    if (targetRow === row && targetCol === col) return false

    const piece = this.pieces[col + (row * 8)]
    const targetPiece = this.pieces[targetCol + (targetRow * 8)]

    if (piece === null) throw new Error('Cannot be null!!')
    if (piece.unicode === '') return false // cannot move empty piece
    if (targetPiece.color === piece.color) return false // target must not be on my own team

    const unicode = piece.unicode
    const targetIsEmpty = targetPiece.isEmpty()
    const targetUnicode = !targetIsEmpty ? targetPiece.unicode : ''
    const targetHasEnemy = targetUnicode !== unicode && !targetIsEmpty

    // pawn rules (white is bottom)
    function pawnRules (state, unicode) {
      if (unicode === wPawn) {
        const oneUp = state.pieces[col + ((row - 1) * 8)]
        const oneUpEmpty = !oneUp || oneUp.unicode === ''

        if (targetRow === row - 1 && targetCol === col && !targetHasEnemy) return true
        if (targetRow === row - 2 && row === 6 && targetCol === col && !targetHasEnemy && oneUpEmpty) return true
        if (targetRow === row - 1 && (targetCol === col - 1 || targetCol === col + 1) && targetHasEnemy) return true
      }
      if (unicode === bPawn) {
        const oneDown = state.pieces[col + ((row + 1) * 8)]
        const oneDownEmpty = !oneDown || oneDown.unicode === ''

        if (targetRow === row + 1 && targetCol === col && !targetHasEnemy) return true
        if (targetRow === row + 2 && row === 1 && targetCol === col && !targetHasEnemy && oneDownEmpty) return true
        if (targetRow === row + 1 && (targetCol === col - 1 || targetCol === col + 1) && targetHasEnemy) return true
      }
      return false
    }

    if (unicode === wPawn || unicode === bPawn) {
      if (pawnRules(this, unicode)) return true
    }

    // rook rules
    function rookRules (state, unicode) {
      let freePath

      if (row === targetRow) {
        const minCol = Math.min(col, targetCol)
        const maxCol = Math.max(col, targetCol)

        freePath = true
        for (let _col = minCol + 1; _col < maxCol; _col++) {
          const thisPiece = state.pieces[_col + (row * 8)]
          freePath &= thisPiece.unicode === ''
        }
        if (freePath) {
          if (targetIsEmpty || targetHasEnemy) return true
        }
      }
      if (col === targetCol) {
        const minRow = Math.min(row, targetRow)
        const maxRow = Math.max(row, targetRow)

        freePath = true
        for (let _row = minRow + 1; _row < maxRow; _row++) {
          const thisPiece = state.pieces[col + (_row * 8)]
          freePath &= thisPiece.unicode === ''
        }
        if (freePath) {
          if (targetIsEmpty || targetHasEnemy) return true
        }
      }
      return false
    }

    if (unicode === wRook || unicode === bRook) {
      if (rookRules(this, unicode)) return true
    }

    // knight rules
    function knightRules (state, unicode) {
      let onPath = Math.abs(row - targetRow) === 2 && Math.abs(col - targetCol) === 1
      onPath |= Math.abs(row - targetRow) === 1 && Math.abs(col - targetCol) === 2
      return onPath && (targetIsEmpty || targetHasEnemy)
    }

    if (unicode === wKnight || unicode === bKnight) {
      if (knightRules(this, unicode)) return true
    }

    // bishop rules
    function bishopRules (state, unicode) {
      // determine if on diagonal path
      let aligned = false
      let _row = row
      let _col = col
      let vDirection = targetRow - row > 0 ? 1 : -1
      let hDirection = targetCol - col > 0 ? 1 : -1

      while (_row >= 0 && _row < 8 && _col >= 0) {
        _row += vDirection
        _col += hDirection
        if (_row === targetRow && _col === targetCol) {
          aligned = true
        }
      }

      // determine if path is free
      let freePath = true
      if (aligned) {
        _row = row
        _col = col
        _row += vDirection
        _col += hDirection

        while (_row >= 1 && _row < 7 && _col >= 1 && _col < 7) {
          const thisPiece = state.pieces[_col + (_row * 8)]

          if (_row !== targetRow && thisPiece.unicode !== '') {
            freePath = false
            break
          }
          if (_row === targetRow) break
          _row += vDirection
          _col += hDirection
        }
      }

      return aligned && freePath
    }

    if (unicode === wBishop || unicode === bBishop) {
      if (bishopRules(this, unicode)) return true
    }

    // queen rules
    function queenRules (state, unicode) {
      return bishopRules(state, unicode) || rookRules(state, unicode)
    }

    if (unicode === wQueen || unicode === bQueen) {
      if (queenRules(this, unicode)) return true
    }

    // king rules
    function kingRules (state, unicode) {
      let hDistance = Math.abs(col - targetCol)
      let vDistance = Math.abs(row - targetRow)

      return hDistance <= 1 && vDistance <= 1 && (targetHasEnemy || targetIsEmpty)
    }

    if (unicode === wKing || unicode === bKing) {
      if (kingRules(this, unicode)) return true
    }

    return false
  }
}
