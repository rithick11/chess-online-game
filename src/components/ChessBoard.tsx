import { GameState, Position, ChessPiece } from '@/types/chess';
import { ChessSquare } from './ChessSquare';
import { isSamePosition } from '@/utils/chessLogic';

interface ChessBoardProps {
  gameState: GameState;
  onSquareClick: (position: Position) => void;
  onPieceMove: (from: Position, to: Position) => void;
}

export function ChessBoard({ gameState, onSquareClick, onPieceMove }: ChessBoardProps) {
  const { board, selectedSquare, validMoves, lastMove, isCheck } = gameState;
  
  const handleDragStart = (e: React.DragEvent, position: Position) => {
    e.dataTransfer.setData('text/plain', `${position.row}-${position.col}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toPosition: Position) => {
    e.preventDefault();
    const fromData = e.dataTransfer.getData('text/plain');
    const [fromRow, fromCol] = fromData.split('-').map(Number);
    const fromPosition = { row: fromRow, col: fromCol };
    
    onPieceMove(fromPosition, toPosition);
  };

  const isSquareInCheck = (position: Position, piece: ChessPiece | null): boolean => {
    return isCheck && piece?.type === 'king' && piece.color === gameState.currentPlayer;
  };

  return (
    <div className="relative">
      {/* Board border and shadow */}
      <div className="p-6 bg-gradient-to-br from-chess-border to-muted rounded-2xl shadow-[var(--shadow-board)] animate-board-glow">
        <div className="grid grid-cols-8 gap-0 border-4 border-chess-border rounded-lg overflow-hidden bg-chess-light">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const position = { row: rowIndex, col: colIndex };
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isSelected = selectedSquare && isSamePosition(selectedSquare, position);
              const isValidMove = validMoves.some(move => isSamePosition(move, position));
              const isLastMove = lastMove && 
                (isSamePosition(lastMove.from, position) || isSamePosition(lastMove.to, position));
              const isInCheck = isSquareInCheck(position, piece);

              return (
                <ChessSquare
                  key={`${rowIndex}-${colIndex}`}
                  piece={piece}
                  position={position}
                  isLight={isLight}
                  isSelected={isSelected}
                  isValidMove={isValidMove}
                  isLastMove={isLastMove}
                  isInCheck={isInCheck}
                  onClick={() => onSquareClick(position)}
                  onDragStart={(e) => handleDragStart(e, position)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, position)}
                />
              );
            })
          )}
        </div>
      </div>
      
      {/* Status overlay */}
      {gameState.gameStatus !== 'playing' && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-2xl">
          <div className="bg-card border border-border rounded-xl p-6 text-center shadow-[var(--shadow-elegant)]">
            <h3 className="text-2xl font-bold mb-2 text-primary">
              {gameState.gameStatus === 'checkmate' && 'Checkmate!'}
              {gameState.gameStatus === 'stalemate' && 'Stalemate!'}
              {gameState.gameStatus === 'draw' && 'Draw!'}
            </h3>
            <p className="text-muted-foreground">
              {gameState.gameStatus === 'checkmate' && 
                `${gameState.currentPlayer === 'white' ? 'Black' : 'White'} wins!`}
              {gameState.gameStatus === 'stalemate' && "It's a draw by stalemate"}
              {gameState.gameStatus === 'draw' && "Game ended in a draw"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}