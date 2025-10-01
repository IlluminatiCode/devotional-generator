/**
 * ThemeSelector Component
 * Grid of theme cards for selecting a devotional theme
 */

'use client';

import { THEME_OPTIONS } from '@/lib/constants';
import SelectionCard from './SelectionCard';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

export default function ThemeSelector({
  selectedTheme,
  onThemeSelect,
}: ThemeSelectorProps) {
  return (
    <div className="input-section">
      <h3 className="section-title text-xl font-bold text-gray-700 dark:text-gray-200 text-center mb-2">
        Select a Theme
      </h3>
      <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
        Select a spiritual theme for your devotional
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {THEME_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            value={option.value}
            emoji={option.emoji}
            label={option.label}
            isSelected={selectedTheme === option.value}
            onClick={onThemeSelect}
          />
        ))}
      </div>
    </div>
  );
}
