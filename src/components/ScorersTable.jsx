import { motion } from 'framer-motion'

export default function ScorersTable({ scorers = [] }) {
    if (scorers.length === 0) {
        return (
            <div className="card p-8 empty-state">
                <div className="empty-state-icon">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="empty-state-title">No goals scored yet</p>
                <p className="empty-state-description">Goal scorers will appear here</p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="table-container bg-white dark:bg-slate-800"
        >
            <table>
                <thead>
                    <tr>
                        <th className="w-12">#</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th className="text-center w-16">Goals</th>
                    </tr>
                </thead>
                <tbody>
                    {scorers.map((scorer, index) => (
                        <motion.tr
                            key={scorer.player_id || index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={index < 3 ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                        >
                            <td>
                                <span className={`font-medium ${index < 3 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {index + 1}
                                </span>
                            </td>
                            <td className="font-medium text-slate-900 dark:text-white">
                                {scorer.scorer_name}
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                        style={{ backgroundColor: scorer.team_color || '#2563eb' }}
                                    >
                                        {scorer.team_name?.charAt(0)}
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-400">
                                        {scorer.team_name}
                                    </span>
                                </div>
                            </td>
                            <td className="text-center">
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                    {scorer.goals}
                                </span>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    )
}
