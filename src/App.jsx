import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

// Layouts
import MainLayout from './layouts/MainLayout'

// Public Pages
import Home from './pages/Home'
import Standings from './pages/Standings'
import Fixtures from './pages/Fixtures'
import Results from './pages/Results'
import TopScorers from './pages/TopScorers'
import PastSeasons from './pages/PastSeasons'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="standings" element={<Standings />} />
            <Route path="fixtures" element={<Fixtures />} />
            <Route path="results" element={<Results />} />
            <Route path="scorers" element={<TopScorers />} />
            <Route path="seasons" element={<PastSeasons />} />
          </Route>

          {/* Redirect any /admin links to home or a 404 since admin is separate now */}
          <Route path="/admin/*" element={<div className="flex items-center justify-center min-h-screen font-medium">Admin panel moved to a separate application.</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
