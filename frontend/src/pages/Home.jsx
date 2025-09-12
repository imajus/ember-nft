import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import SampleTokensGallery from '../components/SampleTokensGallery';

export default function Home() {
  const { connect } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section with Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Launch AI-Generated NFT Collections
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create unique NFT collections with AI-generated artwork. Simply
              provide a prompt and reference image, set your parameters, and let
              our AI create stunning, unique NFTs for your collection.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
              <Link
                to="/create"
                className="block sm:inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-200 text-center"
              >
                Create Collection
              </Link>
              <Link
                to="/explore"
                className="block sm:inline-block bg-white text-purple-600 border-2 border-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50 transition-all duration-200 text-center"
              >
                Explore Collections
              </Link>
            </div>
          </div>
          <div>
            <SampleTokensGallery />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="text-purple-600 text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-4">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Leverage cutting-edge AI to generate unique artwork for every NFT
              in your collection. Each piece is one-of-a-kind and created from
              your custom prompts.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="text-blue-600 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-4">Instant Deployment</h3>
            <p className="text-gray-600">
              Deploy your collection contract and start minting immediately. Our
              platform handles all the technical complexity for you.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="text-green-600 text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-bold mb-4">Collection Forking</h3>
            <p className="text-gray-600">
              Build upon existing collections by forking them with your own
              creative twist. Inherit the original prompt and add your
              modifications to create something new.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="text-orange-600 text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold mb-4">Fair Revenue Split</h3>
            <p className="text-gray-600">
              Keep the majority of your sales with transparent fee structure.
              Built-in royalty system ensures ongoing revenue from secondary
              sales.
            </p>
          </div>
        </div>

        <div className="text-center bg-white rounded-xl p-12 border border-gray-200">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Launch Your Collection?
          </h2>
          <p className="text-gray-600 mb-8">
            Join creators who are already building the future of AI-generated
            NFTs
          </p>
          <button
            onClick={() => connect()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-200"
          >
            Connect Wallet to Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
