/**
 * LoadingSpinner Component
 * Animated loading spinner for async operations
 */

export default function LoadingSpinner() {
  return (
    <div
      className="loading-spinner mx-auto my-6 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
