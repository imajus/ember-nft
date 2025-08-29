import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppKit, useAppKitProvider, useAppKitAccount } from '@reown/appkit/react';

export default function Create() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    supply: '',
    price: '',
    referenceImage: null
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider('eip155');
  const { isConnected } = useAppKitAccount();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, referenceImage: file }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!isConnected || !walletProvider) {
      open();
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement collection creation logic
      console.log('Creating collection with data:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Collection Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="My AI Art Collection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Generation Setup</h2>
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
                This prompt will be used to generate unique artwork for each NFT in your collection.
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Collection Parameters</h2>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Review & Deploy</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Collection Name</h3>
                <p className="text-gray-600">{formData.name}</p>
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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Create AI Collection</h1>
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
              disabled={isLoading || !formData.name || !formData.prompt || !formData.supply || !formData.price}
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
                (currentStep === 1 && (!formData.name || !formData.description)) ||
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