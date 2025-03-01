import LoadingSpinner from './LoadingSpinner';

export default function Button({ 
  children, 
  loading = false, 
  disabled = false, 
  onClick, 
  type = "button",
  variant = "primary",
  size = "default",
  className = ""
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 shadow-sm hover:shadow-md",
    secondary: "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-400",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400"
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size={size === "small" ? "small" : "medium"} />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
} 