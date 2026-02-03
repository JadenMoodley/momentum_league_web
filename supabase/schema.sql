-- =============================================
-- MOMENTUM LEAGUE CORNUBIA - DATABASE SCHEMA
-- =============================================
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  winner_team_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  short_name VARCHAR(10),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#10b981',
  secondary_color VARCHAR(7) DEFAULT '#ffffff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  jersey_number INTEGER,
  position VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE NOT NULL,
  home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  match_date TIMESTAMPTZ NOT NULL,
  venue VARCHAR(200),
  matchday INTEGER,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'postponed', 'cancelled')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  scorer_name VARCHAR(100) NOT NULL,
  minute INTEGER,
  is_own_goal BOOLEAN DEFAULT false,
  is_penalty BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins table (for role check)
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for season winner
ALTER TABLE seasons 
ADD CONSTRAINT fk_winner_team 
FOREIGN KEY (winner_team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- =============================================
-- VIEWS
-- =============================================

-- League Standings View
CREATE OR REPLACE VIEW league_standings AS
WITH match_stats AS (
  SELECT 
    t.id AS team_id,
    t.name AS team_name,
    t.logo_url,
    t.primary_color,
    s.id AS season_id,
    COUNT(CASE WHEN m.status = 'completed' THEN 1 END) AS played,
    COUNT(CASE WHEN m.status = 'completed' AND (
      (m.home_team_id = t.id AND m.home_score > m.away_score) OR
      (m.away_team_id = t.id AND m.away_score > m.home_score)
    ) THEN 1 END) AS won,
    COUNT(CASE WHEN m.status = 'completed' AND m.home_score = m.away_score THEN 1 END) AS drawn,
    COUNT(CASE WHEN m.status = 'completed' AND (
      (m.home_team_id = t.id AND m.home_score < m.away_score) OR
      (m.away_team_id = t.id AND m.away_score < m.home_score)
    ) THEN 1 END) AS lost,
    COALESCE(SUM(CASE 
      WHEN m.status = 'completed' AND m.home_team_id = t.id THEN m.home_score
      WHEN m.status = 'completed' AND m.away_team_id = t.id THEN m.away_score
      ELSE 0 
    END), 0) AS goals_for,
    COALESCE(SUM(CASE 
      WHEN m.status = 'completed' AND m.home_team_id = t.id THEN m.away_score
      WHEN m.status = 'completed' AND m.away_team_id = t.id THEN m.home_score
      ELSE 0 
    END), 0) AS goals_against
  FROM teams t
  CROSS JOIN seasons s
  LEFT JOIN matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id) 
    AND m.season_id = s.id
  WHERE s.is_current = true
  GROUP BY t.id, t.name, t.logo_url, t.primary_color, s.id
)
SELECT 
  team_id,
  team_name,
  logo_url,
  primary_color,
  season_id,
  played,
  won,
  drawn,
  lost,
  goals_for,
  goals_against,
  (goals_for - goals_against) AS goal_difference,
  (won * 3 + drawn) AS points,
  ROW_NUMBER() OVER (ORDER BY (won * 3 + drawn) DESC, (goals_for - goals_against) DESC, goals_for DESC) AS position
FROM match_stats
ORDER BY points DESC, goal_difference DESC, goals_for DESC;

-- Top Scorers View
CREATE OR REPLACE VIEW top_scorers AS
SELECT 
  g.scorer_name,
  g.player_id,
  t.id AS team_id,
  t.name AS team_name,
  t.logo_url AS team_logo,
  COUNT(*) AS goals,
  COUNT(CASE WHEN g.is_penalty THEN 1 END) AS penalties,
  s.id AS season_id
FROM goals g
JOIN matches m ON g.match_id = m.id
JOIN teams t ON g.team_id = t.id
JOIN seasons s ON m.season_id = s.id
WHERE s.is_current = true AND g.is_own_goal = false
GROUP BY g.scorer_name, g.player_id, t.id, t.name, t.logo_url, s.id
ORDER BY goals DESC, scorer_name ASC
LIMIT 20;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seasons policies
CREATE POLICY "Seasons are viewable by everyone" ON seasons
  FOR SELECT USING (true);

CREATE POLICY "Seasons can be modified by admins" ON seasons
  FOR ALL USING (is_admin());

-- Teams policies
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Teams can be modified by admins" ON teams
  FOR ALL USING (is_admin());

-- Players policies
CREATE POLICY "Players are viewable by everyone" ON players
  FOR SELECT USING (true);

CREATE POLICY "Players can be modified by admins" ON players
  FOR ALL USING (is_admin());

-- Matches policies
CREATE POLICY "Matches are viewable by everyone" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Matches can be modified by admins" ON matches
  FOR ALL USING (is_admin());

-- Goals policies
CREATE POLICY "Goals are viewable by everyone" ON goals
  FOR SELECT USING (true);

CREATE POLICY "Goals can be modified by admins" ON goals
  FOR ALL USING (is_admin());

-- Admins table policies (only admins can view/modify admins list)
CREATE POLICY "Admins can view admin list" ON admins
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can modify admin list" ON admins
  FOR ALL USING (is_admin());

-- =============================================
-- REALTIME SUBSCRIPTIONS
-- =============================================

-- Enable realtime for matches and goals
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE goals;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seasons_updated_at
  BEFORE UPDATE ON seasons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (OPTIONAL)
-- =============================================

-- Uncomment below to insert sample data

/*
-- Insert sample season
INSERT INTO seasons (name, start_date, is_current) VALUES 
('Season 2026', '2026-01-01', true);

-- Insert sample teams
INSERT INTO teams (name, short_name, primary_color) VALUES 
('Momentum FC', 'MOM', '#10b981'),
('Cornubia United', 'COR', '#3b82f6'),
('Phoenix Rising', 'PHO', '#f59e0b'),
('Thunder Hawks', 'THU', '#ef4444'),
('Blue Lions', 'BLU', '#0ea5e9'),
('Golden Eagles', 'GOL', '#eab308');
*/
