-- Create leaderboard table for high scores
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  snaps_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view the leaderboard
CREATE POLICY "Anyone can view leaderboard"
  ON public.leaderboard
  FOR SELECT
  USING (true);

-- Allow anyone to insert their score (public game)
CREATE POLICY "Anyone can submit scores"
  ON public.leaderboard
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster sorting
CREATE INDEX idx_leaderboard_score ON public.leaderboard(score DESC);