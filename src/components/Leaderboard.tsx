import { LeaderboardEntry } from "@/hooks/useLeaderboard";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

export const Leaderboard = ({ entries, isLoading }: LeaderboardProps) => {
  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}.`;
  };

  return (
    <div className="w-full max-w-md bg-card/80 backdrop-blur border-2 border-primary/30 rounded-xl p-6">
      <h3 className="font-display text-2xl text-center text-secondary mb-4 tracking-wider">
        🏆 LEADERBOARD
      </h3>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-8">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No scores yet. Be the first!
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center justify-between px-4 py-2 rounded-lg transition-all",
                index < 3 ? "bg-secondary/20" : "bg-background/50"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg w-8">{getMedalEmoji(index)}</span>
                <span className="font-medium text-foreground truncate max-w-32">
                  {entry.player_name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  {entry.snaps_completed}x✨
                </span>
                <span className="font-bold text-secondary">{entry.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
