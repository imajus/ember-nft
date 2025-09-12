import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Web3Provider } from './context/Web3Context'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Create from './pages/Create'
import Dashboard from './pages/Dashboard'
import Collection from './pages/Collection'
import './styles/globals.css'

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/create" element={<Create />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/collection/:collectionId" element={<Collection />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Web3Provider>
  )
}

export default App