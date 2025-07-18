import { ChessPiece, PieceColor } from '@/types/chess';
import { PIECE_SYMBOLS } from '@/utils/chessLogic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CapturedPiecesProps {
  capturedPieces: { white: ChessPiece[]; black: ChessPiece[] };
}

export function CapturedPieces({ capturedPieces }: CapturedPiecesProps) {
  const renderCapturedPieces = (pieces: ChessPiece[], color: PieceColor) => {
    if (pieces.length === 0) {
      return (
        <div className="text-muted-foreground text-sm py-2">
          No pieces captured
        </div>
      );
    }

    // Count pieces by type
    const pieceCounts: Record<string, number> = {};
    pieces.forEach(piece => {
      const key = `${piece.type}`;
      pieceCounts[key] = (pieceCounts[key] || 0) + 1;
    });

    return (
      <div className="flex flex-wrap gap-1">
        {Object.entries(pieceCounts).map(([type, count]) => (
          <div key={type} className="flex items-center">
            <span className="text-2xl">
              {PIECE_SYMBOLS[color][type as keyof typeof PIECE_SYMBOLS[typeof color]]}
            </span>
            {count > 1 && (
              <span className="text-xs font-semibold ml-1 text-muted-foreground">
                {count}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-card to-muted border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Captured by White
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {renderCapturedPieces(capturedPieces.black, 'black')}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card to-muted border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Captured by Black
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {renderCapturedPieces(capturedPieces.white, 'white')}
        </CardContent>
      </Card>
    </div>
  );
}