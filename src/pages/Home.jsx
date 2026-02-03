import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MatchCard from '../components/MatchCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMatches, getStandings, subscribeToMatches, unsubscribe } from '../services/supabase'

export default function Home() {
    const [liveMatches, setLiveMatches] = useState([])
    const [upcomingMatches, setUpcomingMatches] = useState([])
    const [recentResults, setRecentResults] = useState([])
    const [standings, setStandings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()

        const channel = subscribeToMatches(() => {
            fetchData()
        })

        return () => unsubscribe(channel)
    }, [])

    async function fetchData() {
        try {
            const [matchesRes, standingsRes] = await Promise.all([
                getMatches(),
                getStandings()
            ])

            const matches = matchesRes.data || []

            setLiveMatches(matches.filter(m => m.status === 'live'))
            setUpcomingMatches(matches.filter(m => m.status === 'scheduled').slice(0, 3))
            setRecentResults(matches.filter(m => m.status === 'completed').slice(0, 3))
            setStandings((standingsRes.data || []).slice(0, 6))
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="page-container">
            {/* Hero Section */}
            <motion.section
                className="text-center py-12 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                    <span className="gradient-text">Momentum League</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-2">Cornubia</p>
                <p className="text-slate-500 dark:text-slate-500">Indoor Football • Every Wednesday</p>
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Live Matches */}
                    {liveMatches.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="status-dot status-live"></span>
                                <h2 className="section-title">Live Now</h2>
                            </div>
                            <div className="space-y-3">
                                {liveMatches.map(match => (
                                    <MatchCard key={match.id} match={match} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Upcoming Fixtures */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-title">Upcoming Fixtures</h2>
                            <Link to="/fixtures" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                View all
                            </Link>
                        </div>
                        {upcomingMatches.length === 0 ? (
                            <div className="card p-8 empty-state">
                                <p className="empty-state-description">No upcoming fixtures scheduled</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingMatches.map(match => (
                                    <MatchCard key={match.id} match={match} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Recent Results */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-title">Recent Results</h2>
                            <Link to="/results" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                View all
                            </Link>
                        </div>
                        {recentResults.length === 0 ? (
                            <div className="card p-8 empty-state">
                                <p className="empty-state-description">No results yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentResults.map(match => (
                                    <MatchCard key={match.id} match={match} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar - Standings */}
                <aside>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title">Standings</h2>
                        <Link to="/standings" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Full table
                        </Link>
                    </div>
                    <div className="card overflow-hidden">
                        {standings.length === 0 ? (
                            <div className="p-8 empty-state">
                                <p className="empty-state-description">No standings data</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        <th className="px-3 py-2 text-left">#</th>
                                        <th className="px-3 py-2 text-left">Team</th>
                                        <th className="px-3 py-2 text-center">P</th>
                                        <th className="px-3 py-2 text-center">Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((team, index) => (
                                        <tr key={team.team_id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                                            <td className="px-3 py-2 font-medium">{index + 1}</td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                                        style={{ backgroundColor: team.primary_color || '#2563eb' }}
                                                    >
                                                        {team.team_name?.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-white truncate max-w-[100px]">
                                                        {team.team_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-center text-slate-500">{team.played}</td>
                                            <td className="px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400">{team.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
}
