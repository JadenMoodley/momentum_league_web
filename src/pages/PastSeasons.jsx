import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LoadingSpinner from '../components/LoadingSpinner'
import { getSeasons } from '../services/supabase'

export default function PastSeasons() {
    const [seasons, setSeasons] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSeasons()
    }, [])

    async function fetchSeasons() {
        try {
            const { data, error } = await getSeasons()
            if (error) throw error
            setSeasons(data || [])
        } catch (error) {
            console.error('Error fetching seasons:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-ZA', {
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Past Seasons
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        History of champions and previous seasons
                    </p>
                </div>

                {/* Seasons */}
                {loading ? (
                    <LoadingSpinner />
                ) : seasons.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No seasons recorded yet
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Season history will appear here
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seasons.map((season, index) => (
                            <motion.div
                                key={season.id}
                                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg ${season.is_current ? 'ring-2 ring-emerald-500 glow' : ''
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Season Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${season.is_current
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                        {season.is_current ? '🔴 Current' : 'Completed'}
                                    </span>
                                    {!season.is_current && season.winner && (
                                        <span className="text-2xl">🏆</span>
                                    )}
                                </div>

                                {/* Season Name */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {season.name}
                                </h3>

                                {/* Dates */}
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {formatDate(season.start_date)} - {formatDate(season.end_date) || 'Present'}
                                </p>

                                {/* Winner */}
                                {season.winner && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Champion</p>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                                style={{ backgroundColor: '#10b981' }}
                                            >
                                                {season.winner.name?.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {season.winner.name}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {season.is_current && !season.winner && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                            Season in progress...
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
