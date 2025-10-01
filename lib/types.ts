// Type definitions for Devotional Generator API

export interface DevotionalRequest {
  selectedTheme: string;
  selectedAudience?: string;
  selectedMood?: string;
}

export interface DevotionalResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: string;
}

export interface GeminiAPIResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export type Theme =
  | "Patience"
  | "Forgiveness"
  | "Leadership"
  | "Hope"
  | "Love"
  | "Faith"
  | "Gratitude"
  | "Courage"
  | "Wisdom"
  | "Joy"
  | "Kindness"
  | "Humility";

export const THEMES: readonly Theme[] = [
  "Patience",
  "Forgiveness",
  "Leadership",
  "Hope",
  "Love",
  "Faith",
  "Gratitude",
  "Courage",
  "Wisdom",
  "Joy",
  "Kindness",
  "Humility",
] as const;
