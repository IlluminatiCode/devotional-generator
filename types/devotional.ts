/**
 * Theme options for devotional generation
 */
export type DevotionalTheme =
  | 'Patience'
  | 'Forgiveness'
  | 'Leadership'
  | 'Hope'
  | 'Love'
  | 'Faith'
  | 'Gratitude'
  | 'Courage'
  | 'Wisdom'
  | 'Joy'
  | 'Kindness'
  | 'Humility';

/**
 * Target audience options (optional)
 */
export type TargetAudience =
  | ''
  | 'Youth'
  | 'Parents'
  | 'Leaders'
  | 'Students'
  | 'Couples'
  | 'Singles'
  | 'Employee'
  | 'Grandparent';

/**
 * Mood options for personalization (optional)
 */
export type MoodType =
  | ''
  | 'Anxious'
  | 'Grateful'
  | 'Lost'
  | 'Confused'
  | 'Doubting'
  | 'Joyful'
  | 'Stressed'
  | 'Peaceful';

/**
 * Request payload for devotional generation
 */
export interface DevotionalRequest {
  selectedTheme: DevotionalTheme;
  selectedAudience?: TargetAudience;
  selectedMood?: MoodType;
}

/**
 * Individual devotional section
 */
export interface DevotionalSection {
  title: string;
  intro: string;
  scripture: string;
  reflection: string;
  prayer: string;
  challenge: string;
}

/**
 * Complete devotional content response
 */
export interface DevotionalResponse {
  content: DevotionalSection;
  metadata: {
    theme: DevotionalTheme;
    audience?: TargetAudience;
    mood?: MoodType;
    generatedAt: string;
  };
}

/**
 * Gemini API response structure
 */
export interface GeminiApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string | number;
  };
}
