import { useProvider } from '../hooks/useProvider';

export default function Web3Button({
  onClick,
  children,
  disabled = false,
  connectText = 'Connect Wallet',
  className = '',
  ...props
}) {
  const { isConnected, isLoading, connect, error } = useProvider();
  if (!isConnected) {
    return (
      <>
        <button
          onClick={connect}
          disabled={isLoading}
          className={className}
          {...props}
        >
          {isLoading ? 'Connecting...' : connectText}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
