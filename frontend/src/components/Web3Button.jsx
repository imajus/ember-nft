import { useProvider } from '../hooks/useProvider';

export default function Web3Button({ 
  onClick, 
  children, 
  disabled = false, 
  className = '',
  connectText = 'Connect',
  ...props 
}) {
  const { isConnected, connect } = useProvider();

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        className={className}
        {...props}
      >
        {connectText}
      </button>
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