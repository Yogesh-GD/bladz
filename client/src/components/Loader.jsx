const Loader = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center text-white py-6">
      <svg className={`animate-spin ${sizeClass} mb-2`} viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  );
};

export default Loader;
