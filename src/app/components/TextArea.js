export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  rows = 6
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-base font-medium text-gray-600 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`
            w-full px-5 py-4
            text-gray-700 placeholder-gray-400
            bg-white
            border-2 border-gray-200
            rounded-lg
            shadow-sm
            transition duration-200 ease-in-out
            focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:border-transparent
            hover:border-gray-300
            ${className}
          `}
        />
      </div>
    </div>
  );
} 