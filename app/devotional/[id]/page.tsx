/**
 * Devotional Display Page
 * Displays a saved devotional by ID
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DevotionalDisplay from '@/components/DevotionalDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import DarkModeToggle from '@/components/DarkModeToggle';
import type { Devotional } from '@/lib/supabase';

export default function DevotionalPage() {
  const params = useParams();
  const id = params?.id as string;

  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchDevotional = async () => {
      try {
        const response = await fetch(`/api/devotional/${id}`);

        if (!response.ok) {
          throw new Error('Devotional not found');
        }

        const data = await response.json();
        setDevotional(data.devotional);
      } catch (err) {
        console.error('Error fetching devotional:', err);
        setError('Failed to load devotional. It may have been deleted or the link is invalid.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevotional();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 dark:bg-gray-900 p-8">
        <LoadingSpinner />
      </main>
    );
  }

  if (error || !devotional) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 dark:bg-gray-900 p-8">
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
          <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-400 mb-4">
            Devotional Not Found
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The devotional you are looking for could not be found.'}
          </p>
          <div className="text-center">
            <a
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Generate a New Devotional
            </a>
          </div>
        </div>
      </main>
    );
  }

  const sections = {
    title: devotional.title,
    intro: devotional.intro,
    scripture: devotional.scripture,
    reflection: devotional.reflection,
    prayer: devotional.prayer,
    challenge: devotional.challenge,
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

        {/* Devotional Content */}
        <DevotionalDisplay
          sections={sections}
          selectedTheme={devotional.theme}
          selectedAudience={devotional.audience || ''}
          selectedMood={devotional.mood || ''}
          onGenerateAnother={() => window.location.href = '/'}
          onPrint={handlePrint}
          devotionalId={devotional.id}
        />
      </div>
    </main>
  );
}
