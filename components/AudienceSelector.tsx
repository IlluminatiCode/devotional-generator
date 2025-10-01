/**
 * AudienceSelector Component
 * Grid of audience cards for selecting target audience (optional)
 */

'use client';

import { AUDIENCE_OPTIONS } from '@/lib/constants';
import SelectionCard from './SelectionCard';

interface AudienceSelectorProps {
  selectedAudience: string;
  onAudienceSelect: (audience: string) => void;
}

export default function AudienceSelector({
  selectedAudience,
  onAudienceSelect,
}: AudienceSelectorProps) {
  return (
    <div className="input-section">
      <h3 className="section-title text-xl font-bold text-gray-700 dark:text-gray-200 text-center mb-2">
        Select Target Audience (Optional)
      </h3>
      <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
        Who is this devotional for? (Optional)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AUDIENCE_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            value={option.value}
            icon={option.icon}
            label={option.label}
            isSelected={selectedAudience === option.value}
            onClick={onAudienceSelect}
          />
        ))}
      </div>
    </div>
  );
}
