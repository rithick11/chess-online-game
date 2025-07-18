import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Play, Flag, HandHeart, Save } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onSaveGame: () => void;
  canUndo: boolean;
  isGameActive: boolean;
}

export function GameControls({
  onNewGame,
  onUndo,
  onResign,
  onOfferDraw,
  onSaveGame,
  canUndo,
  isGameActive
}: GameControlsProps) {
  return (
    <Card className="bg-gradient-to-b from-card to-muted border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onNewGame} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          New Game
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={onUndo}
            disabled={!canUndo}
            variant="secondary"
            size="sm"
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Undo
          </Button>
          
          <Button 
            onClick={onSaveGame}
            variant="secondary"
            size="sm"
            className="text-xs"
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
        
        {isGameActive && (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={onOfferDraw}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <HandHeart className="w-3 h-3 mr-1" />
              Draw
            </Button>
            
            <Button 
              onClick={onResign}
              variant="destructive"
              size="sm"
              className="text-xs"
            >
              <Flag className="w-3 h-3 mr-1" />
              Resign
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}