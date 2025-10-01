/**
 * HomePage Component
 * Main page for the Devotional Generator application
 * Handles user selections and devotional generation
 */

'use client';

import { useState } from 'react';
import ThemeSelector from '@/components/ThemeSelector';
import AudienceSelector from '@/components/AudienceSelector';
import MoodSelector from '@/components/MoodSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import DevotionalDisplay from '@/components/DevotionalDisplay';
import DarkModeToggle from '@/components/DarkModeToggle';
import { parseDevotionalContent } from '@/lib/utils';
import type { GeminiApiResponse } from '@/types/devotional';

export default function HomePage(): React.JSX.Element {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [devotionalContent, setDevotionalContent] = useState<{
    title: string;
    intro: string;
    scripture: string;
    reflection: string;
    prayer: string;
    challenge: string;
  } | null>(null);
  const [devotionalId, setDevotionalId] = useState<string | null>(null);

  const handleGenerateDevotional = async () => {
    if (!selectedTheme) {
      setErrorMessage('Please select a theme to generate a devotional.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setDevotionalContent(null);

    const payload = {
      selectedTheme,
      selectedAudience,
      selectedMood,
    };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const result = (await response.json()) as GeminiApiResponse;

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0]?.content?.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0]?.text;
        if (text) {
          const sections = parseDevotionalContent(text);
          setDevotionalContent(sections);

          // Save devotional to database
          try {
            const saveResponse = await fetch('/api/devotional', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...sections,
                theme: selectedTheme,
                audience: selectedAudience || null,
                mood: selectedMood || null,
              }),
            });

            if (saveResponse.ok) {
              const saveData = await saveResponse.json();
              setDevotionalId(saveData.id);
            } else {
              console.error('Failed to save devotional');
            }
          } catch (saveError) {
            console.error('Error saving devotional:', saveError);
            // Continue even if save fails - don't break the user experience
          }
        } else {
          throw new Error('No text found in the API response.');
        }
      } else {
        throw new Error('No content found in the API response.');
      }
    } catch (error) {
      console.error('Error generating devotional:', error);
      setErrorMessage(
        `Failed to generate devotional. Please try again. Details: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    setDevotionalContent(null);
    setDevotionalId(null);
    setErrorMessage('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex min-h-screen flex-col items-start justify-start bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 dark:bg-gray-900 p-8">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 relative">
        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4">
          <DarkModeToggle />
        </div>

        {/* Header */}
        <h1 className="text-4xl font-black text-center mb-6">
          <span className="bg-gradient-to-r from-indigo-900 to-yellow-400 bg-clip-text text-transparent">
            Thematic Devotional Generator
          </span>
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10 -mt-4">
          Create personalized, meaningful devotionals tailored to your spiritual
          journey
        </p>

        {/* Generator View */}
        {!devotionalContent && (
          <div className="space-y-6">
            <ThemeSelector
              selectedTheme={selectedTheme}
              onThemeSelect={setSelectedTheme}
            />

            <AudienceSelector
              selectedAudience={selectedAudience}
              onAudienceSelect={setSelectedAudience}
            />

            <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />

            <button
              onClick={handleGenerateDevotional}
              disabled={isLoading || !selectedTheme}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
            >
              Generate Devotional
            </button>

            {isLoading && <LoadingSpinner />}

            {errorMessage && (
              <div className="error-message bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl text-center">
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* Devotional Display View */}
        {devotionalContent && !isLoading && (
          <DevotionalDisplay
            sections={devotionalContent}
            selectedTheme={selectedTheme}
            selectedAudience={selectedAudience}
            selectedMood={selectedMood}
            onGenerateAnother={handleGenerateAnother}
            onPrint={handlePrint}
            devotionalId={devotionalId}
          />
        )}
      </div>
    </main>
  );
}
