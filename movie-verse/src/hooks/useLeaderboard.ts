import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  snaps_completed: number;
  created_at: string;
}

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching leaderboard:", error);
    } else {
      setEntries(data || []);
    }
    setIsLoading(false);
  };

  const submitScore = async (playerName: string, score: number, snapsCompleted: number) => {
    const { error } = await supabase.from("leaderboard").insert({
      player_name: playerName.trim().slice(0, 20),
      score,
      snaps_completed: snapsCompleted,
    });

    if (error) {
      console.error("Error submitting score:", error);
      return false;
    }
    
    await fetchLeaderboard();
    return true;
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return { entries, isLoading, submitScore, refetch: fetchLeaderboard };
};
