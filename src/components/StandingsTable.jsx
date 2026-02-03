import { motion } from 'framer-motion'

export default function StandingsTable({ standings = [] }) {
    if (standings.length === 0) {
        return (
            <div className="card p-8 empty-state">
                <div className="empty-state-icon">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="empty-state-title">No standings data</p>
                <p className="empty-state-description">Standings will appear once matches are played</p>
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
                        <th>Team</th>
                        <th className="text-center w-12">P</th>
                        <th className="text-center w-12">W</th>
                        <th className="text-center w-12">D</th>
                        <th className="text-center w-12">L</th>
                        <th className="text-center w-16">GD</th>
                        <th className="text-center w-14">Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((team, index) => (
                        <motion.tr
                            key={team.team_id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={index < 1 ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                        >
                            <td className="font-medium text-slate-900 dark:text-white">
                                {index + 1}
                            </td>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                        style={{ backgroundColor: team.primary_color || '#2563eb' }}
                                    >
                                        {team.team_name?.charAt(0)}
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {team.team_name}
                                    </span>
                                </div>
                            </td>
                            <td className="text-center text-slate-600 dark:text-slate-400">{team.played}</td>
                            <td className="text-center text-green-600 dark:text-green-400">{team.won}</td>
                            <td className="text-center text-slate-600 dark:text-slate-400">{team.drawn}</td>
                            <td className="text-center text-red-600 dark:text-red-400">{team.lost}</td>
                            <td className="text-center text-slate-600 dark:text-slate-400">
                                {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                            </td>
                            <td className="text-center font-bold text-blue-600 dark:text-blue-400">
                                {team.points}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    )
}
