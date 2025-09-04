import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PrivyProvider } from '@privy-io/react-auth'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Create from './pages/Create'
import Dashboard from './pages/Dashboard'
import Collection from './pages/Collection'
import { somniaTestnet } from './lib/privy'
import './styles/globals.css'

function App() {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        defaultChain: somniaTestnet,
        supportedChains: [somniaTestnet],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        appearance: {
          theme: 'light',
          accentColor: '#8B5CF6'
        }
      }}
    >
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