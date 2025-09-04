import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PrivyProvider } from '@privy-io/react-auth'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Create from './pages/Create'
import Dashboard from './pages/Dashboard'
import Collection from './pages/Collection'
import { privyConfig } from './lib/privy'
import './styles/globals.css'

function App() {
  const appId = import.meta.env.VITE_PRIVY_APP_ID

  if (!appId) {
    return <div>Please set VITE_PRIVY_APP_ID in your .env file</div>
  }

  return (
    <PrivyProvider appId={appId} config={privyConfig}>
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
    </PrivyProvider>
  )
}

export default App