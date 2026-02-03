import { Link } from 'react-router-dom'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Momentum League</p>
                            <p className="text-xs text-slate-400">Cornubia Indoor Football</p>
                        </div>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm">
                        <Link to="/standings" className="hover:text-white transition-colors">
                            Standings
                        </Link>
                        <Link to="/fixtures" className="hover:text-white transition-colors">
                            Fixtures
                        </Link>
                        <Link to="/results" className="hover:text-white transition-colors">
                            Results
                        </Link>
                    </nav>

                    {/* Copyright */}
                    <p className="text-sm text-slate-400">
                        {currentYear} Momentum League
                    </p>
                </div>
            </div>
        </footer>
    )
}
