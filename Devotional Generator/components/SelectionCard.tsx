/**
 * SelectionCard Component
 * Reusable card for theme, audience, and mood selection
 */

import { cn } from '@/lib/utils';

interface SelectionCardProps {
  value: string;
  emoji: string;
  label: string;
  isSelected: boolean;
  onClick: (value: string) => void;
}

export default function SelectionCard({
  value,
  emoji,
  label,
  isSelected,
  onClick,
}: SelectionCardProps) {
  return (
    <div
      className={cn(
        'card group cursor-pointer transition-all duration-200',
        'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600',
        'rounded-xl p-4 text-center font-medium text-gray-700 dark:text-gray-200',
        'flex flex-col items-center justify-center',
        'aspect-[3/1] min-h-[60px]',
        'hover:border-purple-400 dark:hover:border-purple-500',
        'hover:shadow-md hover:-translate-y-0.5',
        isSelected &&
          'bg-indigo-50 dark:bg-indigo-900 border-indigo-600 dark:border-indigo-300',
        isSelected && 'shadow-[0_0_0_3px_rgba(99,102,241,0.2)]',
        isSelected && 'text-indigo-900 dark:text-indigo-100'
      )}
      onClick={() => onClick(value)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(value);
        }
      }}
    >
      <span className="text-4xl mb-2 leading-none">{emoji}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
