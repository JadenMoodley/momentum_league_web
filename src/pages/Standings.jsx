import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StandingsTable from '../components/StandingsTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { getStandings } from '../services/supabase'

export default function Standings() {
    const [standings, setStandings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStandings()
    }, [])

    async function fetchStandings() {
        try {
            const { data, error } = await getStandings()
            if (error) throw error
            setStandings(data || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        League Standings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Current season standings
                    </p>
                </div>

                {/* Table */}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <StandingsTable standings={standings} />

                        {/* Legend */}
                        {standings.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">P</span> - Played
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">W</span> - Won
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">D</span> - Drawn
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">L</span> - Lost
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">GD</span> - Goal Difference
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Pts</span> - Points
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    )
}
