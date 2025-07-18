import { ChessPiece, Position } from '@/types/chess';
import { PIECE_SYMBOLS } from '@/utils/chessLogic';
import { cn } from '@/lib/utils';

interface ChessSquareProps {
  piece: ChessPiece | null;
  position: Position;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  isInCheck: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function ChessSquare({
  piece,
  position,
  isLight,
  isSelected,
  isValidMove,
  isLastMove,
  isInCheck,
  onClick,
  onDragStart,
  onDragOver,
  onDrop
}: ChessSquareProps) {
  return (
    <div
      className={cn(
        'chess-square',
        isLight ? 'light' : 'dark',
        {
          'selected': isSelected,
          'valid-move': isValidMove,
          'last-move': isLastMove,
          'in-check': isInCheck
        }
      )}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-position={`${position.row}-${position.col}`}
    >
      {piece && (
        <div
          className="chess-piece"
          draggable
          onDragStart={onDragStart}
        >
          {PIECE_SYMBOLS[piece.color][piece.type]}
        </div>
      )}
      
      {/* Coordinate labels */}
      {position.col === 0 && (
        <div className="absolute left-1 top-1 text-xs font-semibold opacity-60">
          {8 - position.row}
        </div>
      )}
      {position.row === 7 && (
        <div className="absolute right-1 bottom-1 text-xs font-semibold opacity-60">
          {String.fromCharCode(97 + position.col)}
        </div>
      )}
    </div>
  );
}