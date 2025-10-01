/**
 * SelectionCard Component
 * Reusable card for theme, audience, and mood selection
 * Now with professional Lucide icons
 */

import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface SelectionCardProps {
  value: string;
  icon: string;
  label: string;
  isSelected: boolean;
  onClick: (value: string) => void;
}

export default function SelectionCard({
  value,
  icon,
  label,
  isSelected,
  onClick,
}: SelectionCardProps) {
  // Dynamically get the icon component from lucide-react
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon];

  return (
    <div
      className={cn(
        'card group cursor-pointer transition-all duration-300',
        'bg-white dark:bg-gray-800 border-2',
        'rounded-2xl p-5 text-center font-semibold',
        'flex flex-col items-center justify-center gap-3',
        'aspect-[2/1] min-h-[90px]',
        'hover:shadow-xl hover:scale-105 hover:-translate-y-1',
        'active:scale-95',
        isSelected
          ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700',
        isSelected
          ? 'text-indigo-900 dark:text-indigo-100'
          : 'text-gray-700 dark:text-gray-300'
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
      {IconComponent && (
        <IconComponent
          className={cn(
            'w-8 h-8 transition-all duration-300',
            isSelected
              ? 'text-indigo-600 dark:text-indigo-400 drop-shadow-md'
              : 'text-gray-600 dark:text-gray-400 group-hover:text-indigo-500'
          )}
        />
      )}
      <span className={cn(
        'text-sm font-semibold tracking-wide',
        isSelected && 'font-bold'
      )}>
        {label}
      </span>
    </div>
  );
}
