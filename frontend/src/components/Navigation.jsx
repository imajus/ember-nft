import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="border-b p-6 bg-gradient-to-r from-purple-600 to-blue-600">
      <p className="text-4xl font-bold text-white">Ember AI Launchpad</p>
      <div className="flex mt-4 justify-between items-center">
        <div className="flex">
          <Link to="/" className="mr-6 text-white hover:text-purple-200 font-medium">
            Home
          </Link>
          <Link to="/explore" className="mr-6 text-white hover:text-purple-200 font-medium">
            Explore
          </Link>
          <Link to="/create" className="mr-6 text-white hover:text-purple-200 font-medium">
            Create Collection
          </Link>
          <Link to="/dashboard" className="mr-6 text-white hover:text-purple-200 font-medium">
            Dashboard
          </Link>
        </div>
        <appkit-button />
      </div>
    </nav>
  )
}