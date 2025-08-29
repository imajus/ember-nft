import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { getNFTCollectionFactory } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';

export default function Create() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    prompt: '',
    supply: '',
    price: '',
    referenceImage: null,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const { getSigner, isAvailable } = useProvider();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, referenceImage: file }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const generateSymbol = (name) => {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10);
  };

  const handleSubmit = async () => {
    if (!isConnected || !isAvailable) {
      open();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const signer = await getSigner();
      const factory = await getNFTCollectionFactory(signer);
      // Generate symbol if not provided
      const symbol = formData.symbol || generateSymbol(formData.name);
      // Convert price to wei
      const mintPrice = ethers.parseEther(formData.price);
      const transaction = await factory.createCollection(
        formData.name,
        symbol,
        formData.prompt,
        parseInt(formData.supply),
        mintPrice
      );
      console.log('Transaction submitted:', transaction.hash);
      // Wait for transaction confirmation
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt);
      // Get the collection ID from the event
      const collectionCreatedEvent = receipt.logs.find(
        (log) =>
          log.topics[0] ===
          ethers.id(
            'CollectionCreated(uint256,address,address,string,string,uint256,uint256)'
          )
      );
      if (collectionCreatedEvent) {
        const collectionId = parseInt(collectionCreatedEvent.topics[1]);
        console.log('Collection created with ID:', collectionId);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating collection:', error);
      setError(error.reason || error.message || 'Failed to create collection');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Collection Details
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  handleInputChange('name', e.target.value);
                  // Auto-generate symbol
                  if (!formData.symbol) {
                    handleInputChange('symbol', generateSymbol(e.target.value));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="My AI Art Collection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbol
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) =>
                  handleInputChange('symbol', e.target.value.toUpperCase())
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="MYAI"
                maxLength="10"
              />
              <p className="text-sm text-gray-500 mt-1">
                Short identifier for your collection (auto-generated from name)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your collection..."
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              AI Generation Setup
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Prompt
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe the art style and theme for your collection..."
              />
              <p className="text-sm text-gray-500 mt-2">
                This prompt will be used to generate unique artwork for each NFT
                in your collection.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload a reference image to guide the AI generation style.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Collection Parameters
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Supply
              </label>
              <input
                type="number"
                value={formData.supply}
                onChange={(e) => handleInputChange('supply', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="1000"
                min="1"
                max="10000"
              />
              <p className="text-sm text-gray-500 mt-2">
                How many NFTs will be in your collection? (1-10,000)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mint Price (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.1"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-2">
                Price per NFT in ETH. Set to 0 for free mint.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Review & Deploy
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Collection Name</h3>
                <p className="text-gray-600">{formData.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Symbol</h3>
                <p className="text-gray-600">{formData.symbol}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600">{formData.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">AI Prompt</h3>
                <p className="text-gray-600">{formData.prompt}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <h3 className="font-semibold text-gray-800">Supply</h3>
                  <p className="text-gray-600">{formData.supply} NFTs</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Price</h3>
                  <p className="text-gray-600">{formData.price} ETH</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Create AI Collection
        </h1>
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 ${
                    step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {currentStep === 4 ? (
            <button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !formData.name ||
                !formData.symbol ||
                !formData.prompt ||
                !formData.supply ||
                !formData.price
              }
              className="px-8 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Deploy Collection'
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 &&
                  (!formData.name ||
                    !formData.symbol ||
                    !formData.description)) ||
                (currentStep === 2 && !formData.prompt) ||
                (currentStep === 3 && (!formData.supply || !formData.price))
              }
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
