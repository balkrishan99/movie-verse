import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubmitScoreDialogProps {
  score: number;
  snapsCompleted: number;
  onSubmit: (name: string) => Promise<void>;
  onSkip: () => void;
}

export const SubmitScoreDialog = ({
  score,
  snapsCompleted,
  onSubmit,
  onSkip,
}: SubmitScoreDialogProps) => {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!playerName.trim()) return;
    setIsSubmitting(true);
    await onSubmit(playerName);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card border-2 border-secondary/50 rounded-xl p-8 max-w-md w-full mx-4 shadow-[0_0_60px_hsl(var(--secondary)/0.3)]">
        <h2 className="font-display text-3xl text-center text-secondary mb-2">
          SUBMIT SCORE
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Your Score: <span className="text-secondary font-bold">{score}</span>
          {" · "}
          Snaps: <span className="text-accent font-bold">{snapsCompleted}</span>
        </p>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
            className="text-center text-lg"
            maxLength={20}
            autoFocus
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onSkip}
              disabled={isSubmitting}
            >
              Skip
            </Button>
            <Button
              variant="gauntlet"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!playerName.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
