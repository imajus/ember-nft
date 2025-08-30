import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Create from './pages/Create'
import Dashboard from './pages/Dashboard'
import Collection from './pages/Collection'
import './lib/appkit'
import './styles/globals.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/collection/:collectionId" element={<Collection />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App