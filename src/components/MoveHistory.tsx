import { Move } from '@/types/chess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MoveHistoryProps {
  moves: Move[];
  onMoveClick?: (moveIndex: number) => void;
}

export function MoveHistory({ moves, onMoveClick }: MoveHistoryProps) {
  // Group moves by pairs (white, black)
  const movePairs: Array<{ white?: Move; black?: Move; number: number }> = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      white: moves[i],
      black: moves[i + 1],
      number: Math.floor(i / 2) + 1
    });
  }

  return (
    <Card className="bg-gradient-to-b from-card to-muted border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Move History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 px-4 pb-4">
          {movePairs.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No moves yet
            </p>
          ) : (
            <div className="space-y-1">
              {movePairs.map(({ white, black, number }) => (
                <div 
                  key={number} 
                  className="flex items-center text-sm font-mono bg-muted/30 rounded-md p-2 hover:bg-muted/50 transition-colors"
                >
                  <span className="w-8 text-muted-foreground font-semibold">
                    {number}.
                  </span>
                  
                  {white && (
                    <button
                      className="flex-1 text-left px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                      onClick={() => onMoveClick?.(number * 2 - 2)}
                    >
                      {white.notation}
                    </button>
                  )}
                  
                  {black && (
                    <button
                      className="flex-1 text-left px-2 py-1 rounded hover:bg-primary/10 transition-colors text-muted-foreground"
                      onClick={() => onMoveClick?.(number * 2 - 1)}
                    >
                      {black.notation}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}