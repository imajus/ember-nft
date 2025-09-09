import PropTypes from 'prop-types';

const SOMNIA_TESTNET = {
  blockExplorers: {
    default: {
      url: 'https://somnia-testnet.socialscan.io',
    },
  },
};

/**
 * @typedef {Object} AddressDisplayProps
 * @property {string} address - The Ethereum address to display
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [copyable] - Whether to show copy button (default: false)
 */

/**
 * Component for displaying Ethereum addresses with blockchain explorer links
 * @param {AddressDisplayProps} props
 */
export default function AddressDisplay({
  address,
  className = '',
  copyable = false,
}) {
  if (!address) return null;

  // Always use Somnia Testnet since it's the only supported network
  const network = SOMNIA_TESTNET;

  const formatAddress = (addr) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}..${addr.slice(-4)}`;
  };

  const getExplorerUrl = () => {
    const baseUrl = network?.blockExplorers?.default?.url;
    return baseUrl ? `${baseUrl}/address/${address}` : null;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const explorerUrl = getExplorerUrl();
  const formattedAddress = formatAddress(address);

  const addressElement = (
    <span className={`font-mono text-sm ${className}`} title={address}>
      {formattedAddress}
    </span>
  );

  return (
    <span className="inline-flex items-center space-x-1">
      {explorerUrl ? (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-blue-600 hover:text-blue-800 transition-colors ${className}`}
        >
          {addressElement}
        </a>
      ) : (
        addressElement
      )}

      {copyable && (
        <button
          onClick={handleCopy}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Copy address"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

AddressDisplay.propTypes = {
  address: PropTypes.string.isRequired,
  className: PropTypes.string,
  copyable: PropTypes.bool,
};
