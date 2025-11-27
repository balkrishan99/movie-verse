import { InfinityStone, StoneType, stoneTypes } from "./InfinityStone";
import { cn } from "@/lib/utils";

interface StoneCollectionProps {
  collectedStones: Record<StoneType, number>;
}

export const StoneCollection = ({ collectedStones }: StoneCollectionProps) => {
  const allCollected = stoneTypes.every(type => collectedStones[type] > 0);

  return (
    <div className={cn(
      "flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-500",
      allCollected 
        ? "border-secondary bg-secondary/10 shadow-[0_0_40px_hsl(var(--secondary)/0.3)]" 
        : "border-primary/30 bg-card/50"
    )}>
      <h3 className={cn(
        "font-display text-2xl tracking-wider",
        allCollected ? "text-secondary glow-gold" : "text-foreground"
      )}>
        {allCollected ? "INFINITY COMPLETE!" : "INFINITY STONES"}
      </h3>
      
      <div className="flex gap-4 items-center">
        {stoneTypes.map((type, index) => (
          <div 
            key={type} 
            className="flex flex-col items-center gap-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <InfinityStone
              type={type}
              size="md"
              collected={collectedStones[type] > 0}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {type}
            </span>
            {collectedStones[type] > 0 && (
              <span className="text-xs font-bold text-secondary">
                ×{collectedStones[type]}
              </span>
            )}
          </div>
        ))}
      </div>

      {allCollected && (
        <p className="text-sm text-secondary animate-pulse">
          Press SNAP to use the power!
        </p>
      )}
    </div>
  );
};
