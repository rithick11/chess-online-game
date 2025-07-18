export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  promotion?: PieceType;
  notation: string;
}

export interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: PieceColor;
  selectedSquare: Position | null;
  validMoves: Position[];
  lastMove: Move | null;
  moveHistory: Move[];
  capturedPieces: { white: ChessPiece[]; black: ChessPiece[] };
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  gameStatus: 'playing' | 'checkmate' | 'stalemate' | 'draw';
  enPassantTarget: Position | null;
}