import { useProvider } from '../hooks/useProvider';
import PropTypes from 'prop-types';

export default function Web3Button({ 
  onClick, 
  children, 
  disabled = false, 
  className = '',
  connectText = 'Connect Wallet',
  ...props 
}) {
  const { isConnected, isLoading, connect, error } = useProvider();

  if (!isConnected) {
    return (
      <div>
        <button
          onClick={connect}
          disabled={isLoading}
          className={className}
          {...props}
        >
          {isLoading ? 'Connecting...' : connectText}
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
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

Web3Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  connectText: PropTypes.string,
};