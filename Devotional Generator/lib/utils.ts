import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DevotionalTheme } from '@/types';
import { BIBLE_VERSES_BY_THEME } from './constants';

/**
 * Utility function for merging Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Get random Bible verses for a given theme
 * @param theme - The devotional theme
 * @param count - Number of verses to retrieve (default: 2)
 * @returns Array of random verses
 */
export function getRandomVerses(theme: DevotionalTheme, count = 2): readonly string[] {
  const verses = BIBLE_VERSES_BY_THEME[theme];
  if (!verses || verses.length === 0) {
    return [];
  }

  // Create a copy and shuffle using Fisher-Yates algorithm
  const shuffled = [...verses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, verses.length));
}

/**
 * Clean markdown formatting from text
 * Removes bold, italic, and heading syntax
 */
export function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/^#+\s*/gm, '') // Remove headings
    .trim();
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Type guard to check if a value is a valid DevotionalTheme
 */
export function isValidTheme(value: unknown): value is DevotionalTheme {
  const validThemes: readonly string[] = [
    'Patience',
    'Forgiveness',
    'Leadership',
    'Hope',
    'Love',
    'Faith',
    'Gratitude',
    'Courage',
    'Wisdom',
    'Joy',
    'Kindness',
    'Humility',
  ];
  return typeof value === 'string' && validThemes.includes(value);
}

/**
 * Parse devotional content into structured sections
 * @param devotionalContent - Raw text from API response
 * @returns Structured devotional sections
 */
export function parseDevotionalContent(devotionalContent: string): {
  title: string;
  intro: string;
  scripture: string;
  reflection: string;
  prayer: string;
  challenge: string;
} {
  const sections = {
    title: '',
    intro: '',
    scripture: '',
    reflection: '',
    prayer: '',
    challenge: '',
  };

  const parts = devotionalContent.split(
    /(Concise Title \(3-6 words\):|Introductory Thought:|Scripture:|Reflection:|Prayer:|Today's Challenge:)/
  );

  let currentSection = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]?.trim() ?? '';

    if (part === 'Concise Title (3-6 words):') {
      currentSection = 'title';
    } else if (part === 'Introductory Thought:') {
      currentSection = 'intro';
    } else if (part === 'Scripture:') {
      currentSection = 'scripture';
    } else if (part === 'Reflection:') {
      currentSection = 'reflection';
    } else if (part === 'Prayer:') {
      currentSection = 'prayer';
    } else if (part === "Today's Challenge:") {
      currentSection = 'challenge';
    } else if (currentSection) {
      sections[currentSection as keyof typeof sections] += part.trim() + '\n';
    }
  }

  // Clean markdown from all sections
  for (const key in sections) {
    sections[key as keyof typeof sections] = cleanMarkdown(
      sections[key as keyof typeof sections].trim()
    );
  }

  return sections;
}
