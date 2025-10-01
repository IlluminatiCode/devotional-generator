/**
 * MoodSelector Component
 * Grid of mood cards for selecting current mood (optional)
 */

'use client';

import { MOOD_OPTIONS } from '@/lib/constants';
import SelectionCard from './SelectionCard';

interface MoodSelectorProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}

export default function MoodSelector({
  selectedMood,
  onMoodSelect,
}: MoodSelectorProps) {
  return (
    <div className="input-section">
      <h3 className="section-title text-xl font-bold text-gray-700 dark:text-gray-200 text-center mb-2">
        How Are You Feeling?
      </h3>
      <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
        Select your current mood for a personalized devotional
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MOOD_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            value={option.value}
            emoji={option.emoji}
            label={option.label}
            isSelected={selectedMood === option.value}
            onClick={onMoodSelect}
          />
        ))}
      </div>
    </div>
  );
}
