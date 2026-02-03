import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MatchCard from '../components/MatchCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMatches } from '../services/supabase'

export default function Results() {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMatches()
    }, [])

    async function fetchMatches() {
        try {
            const { data, error } = await getMatches('completed')
            if (error) throw error
            // Sort by date descending (most recent first)
            const sorted = (data || []).sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
            setMatches(sorted)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Group by matchday
    const matchesByDay = matches.reduce((acc, match) => {
        const day = match.matchday || 'Past'
        if (!acc[day]) acc[day] = []
        acc[day].push(match)
        return acc
    }, {})

    return (
        <div className="page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Results
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Completed matches
                    </p>
                </div>

                {/* Matches */}
                {loading ? (
                    <LoadingSpinner />
                ) : Object.keys(matchesByDay).length === 0 ? (
                    <div className="card p-12 empty-state">
                        <p className="empty-state-title">No results yet</p>
                        <p className="empty-state-description">Match results will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(matchesByDay).sort(([a], [b]) => Number(b) - Number(a)).map(([day, dayMatches]) => (
                            <section key={day}>
                                <h2 className="section-title mb-4">Matchday {day}</h2>
                                <div className="space-y-3">
                                    {dayMatches.map(match => (
                                        <MatchCard key={match.id} match={match} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
