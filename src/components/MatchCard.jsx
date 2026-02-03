import { motion } from 'framer-motion'

export default function MatchCard({ match }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' }),
            time: date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
        }
    }

    const { date, time } = formatDate(match.match_date)
    const isLive = match.status === 'live'
    const isCompleted = match.status === 'completed'

    return (
        <motion.div
            className={`card p-4 ${isLive ? 'ring-2 ring-red-500' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                    {isLive && (
                        <span className="badge badge-red flex items-center gap-1">
                            <span className="status-dot status-live"></span>
                            LIVE
                        </span>
                    )}
                    {!isLive && (
                        <span className="text-slate-500 dark:text-slate-400">{date}</span>
                    )}
                </div>
                <span className="text-slate-500 dark:text-slate-400">
                    {match.venue || 'Pitch 1'} • {time}
                </span>
            </div>

            {/* Teams & Score */}
            <div className="flex items-center">
                {/* Home Team */}
                <div className="flex-1 flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: match.home_team?.primary_color || '#2563eb' }}
                    >
                        {match.home_team?.short_name || match.home_team?.name?.charAt(0) || 'H'}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                        {match.home_team?.name || 'Home Team'}
                    </span>
                </div>

                {/* Score */}
                <div className="px-4 text-center">
                    {isCompleted || isLive ? (
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${isLive ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                {match.home_score}
                            </span>
                            <span className="text-slate-400">-</span>
                            <span className={`text-2xl font-bold ${isLive ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                {match.away_score}
                            </span>
                        </div>
                    ) : (
                        <span className="text-slate-400 text-sm">vs</span>
                    )}
                </div>

                {/* Away Team */}
                <div className="flex-1 flex items-center gap-3 justify-end">
                    <span className="font-medium text-slate-900 dark:text-white text-right">
                        {match.away_team?.name || 'Away Team'}
                    </span>
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: match.away_team?.primary_color || '#0ea5e9' }}
                    >
                        {match.away_team?.short_name || match.away_team?.name?.charAt(0) || 'A'}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
