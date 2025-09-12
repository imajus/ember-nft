export default function NumberDisplay({ value, suffix = '', className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    primary: 'bg-purple-100 text-purple-800 border border-purple-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${variantClass} ${className}`}>
      {value}
      {suffix && <span className="ml-1 opacity-75">{suffix}</span>}
    </span>
  );
}