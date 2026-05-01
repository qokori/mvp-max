export default function Button({ children, className = '', variant = 'primary', size = 'md', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${size === 'lg' ? 'px-6 py-3 text-lg' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}