import { useProvider } from '../hooks/useProvider';
import { useState } from 'react';

const buttonVariants = {
  primary: {
    base: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200',
    enabled: 'hover:shadow-lg transform hover:scale-105 cursor-pointer',
    disabled: 'opacity-60 cursor-not-allowed animate-pulse'
  },
  secondary: {
    base: 'bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200',
    enabled: 'hover:shadow-lg transform hover:scale-105 cursor-pointer',
    disabled: 'opacity-60 cursor-not-allowed animate-pulse'
  }
};

export default function Web3Button({
  onClick,
  children,
  disabled = false,
  connectText = 'Connect Wallet',
  loadingText,
  variant = 'primary',
  className = '',
  ...props
}) {
  const { isConnected, isLoading, connect, error } = useProvider();
  const [isExecuting, setIsExecuting] = useState(false);

  const getButtonClasses = (isDisabled = false) => {
    const variantStyles = buttonVariants[variant] || buttonVariants.primary;
    const baseClasses = variantStyles.base;
    const stateClasses = isDisabled ? variantStyles.disabled : variantStyles.enabled;
    return `${baseClasses} ${stateClasses} ${className}`.trim();
  };

  if (!isConnected) {
    return (
      <>
        <button
          onClick={connect}
          disabled={isLoading}
          className={getButtonClasses(isLoading)}
          {...props}
        >
          {isLoading ? 'Connecting...' : connectText}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </>
    );
  }

  const handleClick = async (event) => {
    if (!onClick || disabled || isExecuting) return;

    setIsExecuting(true);

    try {
      await onClick(event);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isExecuting}
        className={getButtonClasses(disabled || isExecuting)}
        {...props}
      >
        {isExecuting ? loadingText || 'Processing...' : children}
      </button>
    </>
  );
}
