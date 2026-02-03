import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ScorersTable from '../components/ScorersTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { getTopScorers } from '../services/supabase'

export default function TopScorers() {
    const [scorers, setScorers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchScorers()
    }, [])

    async function fetchScorers() {
        try {
            const { data, error } = await getTopScorers()
            if (error) throw error
            setScorers(data || [])
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
                        Top Scorers
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Leading goal scorers this season
                    </p>
                </div>

                {/* Top 3 Podium */}
                {!loading && scorers.length >= 3 && (
                    <div className="mb-8 flex items-end justify-center gap-4">
                        {/* 2nd */}
                        <div className="text-center w-24">
                            <div className="w-14 h-14 mx-auto mb-2 bg-slate-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                2
                            </div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                {scorers[1]?.scorer_name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{scorers[1]?.team_name}</p>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {scorers[1]?.goals}
                            </p>
                        </div>

                        {/* 1st */}
                        <div className="text-center w-28 -mt-4">
                            <div className="w-16 h-16 mx-auto mb-2 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                1
                            </div>
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {scorers[0]?.scorer_name}
                            </p>
                            <p className="text-sm text-slate-500 truncate">{scorers[0]?.team_name}</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {scorers[0]?.goals}
                            </p>
                        </div>

                        {/* 3rd */}
                        <div className="text-center w-24">
                            <div className="w-14 h-14 mx-auto mb-2 bg-amber-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                3
                            </div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                {scorers[2]?.scorer_name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{scorers[2]?.team_name}</p>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {scorers[2]?.goals}
                            </p>
                        </div>
                    </div>
                )}

                {/* Table */}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <ScorersTable scorers={scorers} />
                )}
            </motion.div>
        </div>
    )
}
