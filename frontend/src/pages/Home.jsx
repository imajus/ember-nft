import { Link } from 'react-router-dom';
import { useAppKit } from '@reown/appkit/react';

export default function Home() {
  const { open } = useAppKit();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Launch AI-Generated NFT Collections
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create unique NFT collections with AI-generated artwork. Simply provide a prompt and reference image, 
            set your parameters, and let our AI create stunning, unique NFTs for your collection.
          </p>
          <div className="space-x-4">
            <Link
              to="/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Create Collection
            </Link>
            <Link
              to="/explore"
              className="inline-block bg-white text-purple-600 border-2 border-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50 transition-all duration-200"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-purple-600 text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-4">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Leverage cutting-edge AI to generate unique artwork for every NFT in your collection. 
              Each piece is one-of-a-kind and created from your custom prompts.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-blue-600 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-4">Instant Deployment</h3>
            <p className="text-gray-600">
              Deploy your collection contract and start minting immediately. 
              Our platform handles all the technical complexity for you.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-green-600 text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold mb-4">Fair Revenue Split</h3>
            <p className="text-gray-600">
              Keep the majority of your sales with transparent fee structure. 
              Built-in royalty system ensures ongoing revenue from secondary sales.
            </p>
          </div>
        </div>

        <div className="text-center bg-white rounded-xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Ready to Launch Your Collection?</h2>
          <p className="text-gray-600 mb-8">
            Join creators who are already building the future of AI-generated NFTs
          </p>
          <button
            onClick={() => open()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Connect Wallet to Get Started
          </button>
        </div>
      </div>
    </div>
  );
}