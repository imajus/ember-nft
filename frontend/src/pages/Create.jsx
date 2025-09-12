import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { getNFTCollectionFactory } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';
// import { uploadFileToIPFS } from '../lib/ipfs';
import Web3Button from '../components/Web3Button';
import CollectionCover from '../components/CollectionCover';

export default function Create() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    prompt: '',
    supply: '',
    price: '',
    referenceImage: null,
    referenceImageUrl: null,
  });
  const [currentStep, setCurrentStep] = useState(1);
  // const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [parentCollection, setParentCollection] = useState(null);
  const [isForking, setIsForking] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { getSigner, getProvider } = useProvider();

  // Check if this is a fork creation from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const forkFromId = urlParams.get('forkFrom');

    if (forkFromId) {
      setIsForking(true);
      loadParentCollection(forkFromId);
    }
  }, [location.search]);

  const loadParentCollection = async (parentId) => {
    try {
      const provider = getProvider();
      const factory = await getNFTCollectionFactory(provider);
      const parentInfo = await factory.collectionInfo(parentId);

      setParentCollection({
        id: parentId,
        name: parentInfo.name,
        symbol: parentInfo.symbol,
        prompt: parentInfo.prompt,
        contractAddress: parentInfo.contractAddress,
        creator: parentInfo.creator,
      });
    } catch (error) {
      console.error('Error loading parent collection:', error);
      setError('Failed to load parent collection information');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // Validate file type
  //   if (!file.type.startsWith('image/')) {
  //     setError('Please select a valid image file');
  //     return;
  //   }

  //   // Validate file size (max 10MB)
  //   if (file.size > 10 * 1024 * 1024) {
  //     setError('Image file size must be less than 10MB');
  //     return;
  //   }

  //   setIsUploadingImage(true);
  //   setError('');

  //   try {
  //     const uploadResult = await uploadFileToIPFS(file, {
  //       name: `reference-image-${Date.now()}.${file.name.split('.').pop()}`,
  //       keyvalues: {
  //         type: 'reference-image',
  //         collection: formData.name || 'unnamed-collection',
  //       },
  //     });

  //     setFormData((prev) => ({
  //       ...prev,
  //       referenceImage: file,
  //       referenceImageUrl: uploadResult.ipfsUrl,
  //     }));

  //     console.log('Image uploaded to IPFS:', uploadResult);
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //     setError(`Failed to upload image: ${error.message}`);
  //     // Reset the file input
  //     e.target.value = '';
  //   } finally {
  //     setIsUploadingImage(false);
  //   }
  // };

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
    setError('');
    try {
      const signer = await getSigner();
      const factory = await getNFTCollectionFactory(signer);
      // Generate symbol if not provided
      const symbol = formData.symbol || generateSymbol(formData.name);
      // Convert price to wei
      const mintPrice = ethers.parseEther(formData.price);
      // Get the collection creation price (LLM generation fee)
      const creationPrice = await factory.getCollectionPrice();

      // Determine parent collection ID
      const parentId =
        isForking && parentCollection ? parseInt(parentCollection.id) : 0;

      const transaction = await factory.createCollection(
        formData.name,
        symbol,
        formData.prompt.replace(/\s+/g, ' ').trim(),
        formData.referenceImageUrl || '',
        parseInt(formData.supply),
        mintPrice,
        parentId,
        { value: creationPrice }
      );
      if (formData.referenceImageUrl) {
        console.log(
          'Reference image URL passed to contract:',
          formData.referenceImageUrl
        );
      }
      console.log('Transaction submitted:', transaction.hash);
      // Wait for transaction confirmation
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt);
      // Get the collection ID from the event
      // const collectionCreatedEvent = receipt.logs.find(
      //   (log) =>
      //     log.topics[0] ===
      //     ethers.id(
      //       'CollectionCreated(uint256,address,address,string,string,uint256,uint256)'
      //     )
      // );
      // if (collectionCreatedEvent) {
      //   const collectionId = parseInt(collectionCreatedEvent.topics[1]);
      //   console.log('Collection created with ID:', collectionId);
      // }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating collection:', error);
      setError(error.reason || error.message || 'Failed to create collection');
      throw error;
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
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Image (Optional)
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {isUploadingImage && (
                  <div className="flex items-center text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading image to IPFS...
                  </div>
                )}

                {formData.referenceImage && !isUploadingImage && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={URL.createObjectURL(formData.referenceImage)}
                        alt="Reference"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 truncate">
                        {formData.referenceImage.name}
                      </p>
                      <p className="text-xs text-green-600">
                        Uploaded to IPFS successfully
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          referenceImage: null,
                          referenceImageUrl: null,
                        }))
                      }
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Upload a reference image to guide the AI generation style. Max
                size: 10MB.
              </p>
            </div> */}
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
                <h3 className="font-semibold text-gray-800">AI Prompt</h3>
                <p className="text-gray-600">{formData.prompt}</p>
              </div>
              {formData.referenceImage && (
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Reference Image
                  </h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(formData.referenceImage)}
                        alt="Reference"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {formData.referenceImage.name}
                      </p>
                      <p className="text-xs text-green-600">Stored on IPFS</p>
                    </div>
                  </div>
                </div>
              )}
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
          {isForking ? 'Fork AI Collection' : 'Create AI Collection'}
        </h1>
        {isForking && parentCollection && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 overflow-hidden rounded-lg flex-shrink-0">
                <CollectionCover
                  contractAddress={parentCollection.contractAddress}
                  alt={parentCollection.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-700 font-medium">
                  🍴 Forking from:{' '}
                  <span className="font-bold">{parentCollection.name}</span>
                </p>
                {/* <p className="text-xs text-purple-600 mt-1">
                  Original prompt: &quot;{parentCollection.prompt}&quot;
                </p> */}
                {/* <p className="text-xs text-purple-500 mt-1 font-mono">
                  {parentCollection.contractAddress}
                </p> */}
              </div>
            </div>
          </div>
        )}
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

      <div className="bg-white rounded-xl border border-gray-200 p-8">
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
            <Web3Button
              onClick={handleSubmit}
              disabled={
                !formData.name ||
                !formData.symbol ||
                !formData.prompt ||
                !formData.supply ||
                !formData.price
              }
              loadingText="Creating..."
            >
              Deploy Collection
            </Web3Button>
          ) : (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && (!formData.name || !formData.symbol)) ||
                (currentStep === 2 && !formData.prompt) ||
                (currentStep === 3 && (!formData.supply || !formData.price))
              }
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all duration-200"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
