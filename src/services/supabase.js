import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)

// =============================================
// Auth Functions
// =============================================

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    return { data, error }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function isAdmin() {
    const user = await getCurrentUser()
    if (!user) return false

    const { data } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single()

    return !!data
}

// =============================================
// Season Functions
// =============================================

export async function getSeasons() {
    const { data, error } = await supabase
        .from('seasons')
        .select('*, winner:winner_team_id(id, name, logo_url)')
        .order('start_date', { ascending: false })
    return { data, error }
}

export async function getCurrentSeason() {
    const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('is_current', true)
        .single()
    return { data, error }
}

export async function createSeason(seasonData) {
    const { data, error } = await supabase
        .from('seasons')
        .insert(seasonData)
        .select()
        .single()
    return { data, error }
}

export async function updateSeason(id, updates) {
    const { data, error } = await supabase
        .from('seasons')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    return { data, error }
}

// =============================================
// Team Functions
// =============================================

export async function getTeams() {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name')
    return { data, error }
}

export async function getTeam(id) {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single()
    return { data, error }
}

export async function createTeam(teamData) {
    const { data, error } = await supabase
        .from('teams')
        .insert(teamData)
        .select()
        .single()
    return { data, error }
}

export async function updateTeam(id, updates) {
    const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    return { data, error }
}

export async function deleteTeam(id) {
    const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)
    return { error }
}

// =============================================
// Match Functions
// =============================================

export async function getMatches(status = null) {
    let query = supabase
        .from('matches')
        .select(`
      *,
      home_team:home_team_id(id, name, short_name, logo_url, primary_color),
      away_team:away_team_id(id, name, short_name, logo_url, primary_color),
      season:season_id!inner(id, name, is_current)
    `)
        .eq('season.is_current', true)
        .order('match_date', { ascending: true })

    if (status) {
        query = query.eq('status', status)
    }

    const { data, error } = await query
    return { data, error }
}

export async function getLiveMatches() {
    return getMatches('live')
}

export async function getUpcomingMatches() {
    const { data, error } = await supabase
        .from('matches')
        .select(`
      *,
      home_team:home_team_id(id, name, short_name, logo_url, primary_color),
      away_team:away_team_id(id, name, short_name, logo_url, primary_color),
      season:season_id!inner(id, name, is_current)
    `)
        .eq('season.is_current', true)
        .eq('status', 'scheduled')
        .order('match_date', { ascending: true })
    return { data, error }
}

export async function getCompletedMatches() {
    const { data, error } = await supabase
        .from('matches')
        .select(`
      *,
      home_team:home_team_id(id, name, short_name, logo_url, primary_color),
      away_team:away_team_id(id, name, short_name, logo_url, primary_color),
      season:season_id!inner(id, name, is_current)
    `)
        .eq('season.is_current', true)
        .eq('status', 'completed')
        .order('match_date', { ascending: false })
    return { data, error }
}

export async function getMatch(id) {
    const { data, error } = await supabase
        .from('matches')
        .select(`
      *,
      home_team:home_team_id(id, name, short_name, logo_url, primary_color),
      away_team:away_team_id(id, name, short_name, logo_url, primary_color),
      goals(*)
    `)
        .eq('id', id)
        .single()
    return { data, error }
}

export async function createMatch(matchData) {
    const { data, error } = await supabase
        .from('matches')
        .insert(matchData)
        .select()
        .single()
    return { data, error }
}

export async function updateMatch(id, updates) {
    const { data, error } = await supabase
        .from('matches')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    return { data, error }
}

export async function startMatch(id) {
    return updateMatch(id, {
        status: 'live',
        started_at: new Date().toISOString()
    })
}

export async function endMatch(id) {
    return updateMatch(id, {
        status: 'completed',
        ended_at: new Date().toISOString()
    })
}

export async function deleteMatch(id) {
    const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id)
    return { error }
}

// =============================================
// Goal Functions
// =============================================

export async function getMatchGoals(matchId) {
    const { data, error } = await supabase
        .from('goals')
        .select(`
      *,
      team:team_id(id, name, short_name)
    `)
        .eq('match_id', matchId)
        .order('minute', { ascending: true })
    return { data, error }
}

export async function addGoal(goalData) {
    const { data, error } = await supabase
        .from('goals')
        .insert(goalData)
        .select()
        .single()

    // Update match score
    if (!error && data) {
        const { data: match } = await getMatch(goalData.match_id)
        if (match) {
            const isHomeTeam = goalData.team_id === match.home_team.id
            const updates = isHomeTeam
                ? { home_score: match.home_score + 1 }
                : { away_score: match.away_score + 1 }
            await updateMatch(goalData.match_id, updates)
        }
    }

    return { data, error }
}

export async function deleteGoal(goalId, matchId, teamId, isHomeTeam) {
    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)

    // Update match score
    if (!error) {
        const { data: match } = await getMatch(matchId)
        if (match) {
            const updates = isHomeTeam
                ? { home_score: Math.max(0, match.home_score - 1) }
                : { away_score: Math.max(0, match.away_score - 1) }
            await updateMatch(matchId, updates)
        }
    }

    return { error }
}

// =============================================
// Standings & Stats
// =============================================

export async function getStandings() {
    const { data, error } = await supabase
        .from('league_standings')
        .select('*')
    return { data, error }
}

export async function getTopScorers() {
    const { data, error } = await supabase
        .from('top_scorers')
        .select('*')
    return { data, error }
}

// =============================================
// Realtime Subscriptions
// =============================================

export function subscribeToMatches(callback) {
    return supabase
        .channel('matches-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'matches' },
            (payload) => callback(payload)
        )
        .subscribe()
}

export function subscribeToGoals(callback) {
    return supabase
        .channel('goals-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'goals' },
            (payload) => callback(payload)
        )
        .subscribe()
}

export function subscribeToMatch(matchId, callback) {
    return supabase
        .channel(`match-${matchId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'matches',
                filter: `id=eq.${matchId}`
            },
            (payload) => callback(payload)
        )
        .subscribe()
}

export function unsubscribe(channel) {
    supabase.removeChannel(channel)
}
