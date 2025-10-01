/**
 * DevotionalDisplay Component
 * Displays the generated devotional content in formatted sections
 */

'use client';

import ShareButtons from './ShareButtons';
import PDFExport from './PDFExport';

interface DevotionalDisplayProps {
  sections: {
    title: string;
    intro: string;
    scripture: string;
    reflection: string;
    prayer: string;
    challenge: string;
  };
  selectedTheme: string;
  selectedAudience: string;
  selectedMood: string;
  onGenerateAnother: () => void;
  onPrint: () => void;
}

export default function DevotionalDisplay({
  sections,
  selectedTheme,
  selectedAudience,
  selectedMood,
  onGenerateAnother,
  onPrint,
}: DevotionalDisplayProps) {
  const devotionalTitle = sections.title || 'A Moment of Reflection';

  // Prepare content for sharing
  const shareContent = `${sections.intro}\n\nScripture: ${sections.scripture}\n\nReflection: ${sections.reflection}\n\nPrayer: ${sections.prayer}\n\nToday's Challenge: ${sections.challenge}`;

  return (
    <div id="devotional-content" className="devotional-output text-gray-700 dark:text-gray-200 leading-relaxed">
      {/* Tags */}
      <div className="tag-container flex justify-center flex-wrap gap-2 mb-6">
        <span className="tag theme-tag bg-indigo-900 dark:bg-indigo-200 text-white dark:text-indigo-900 px-3 py-1 rounded-lg text-sm font-semibold">
          {selectedTheme}
        </span>
        {selectedAudience && (
          <span className="tag audience-tag bg-yellow-400 dark:bg-yellow-300 text-gray-800 dark:text-gray-900 px-3 py-1 rounded-lg text-sm font-semibold">
            For {selectedAudience}
          </span>
        )}
        {selectedMood && (
          <span className="tag mood-tag bg-purple-400 dark:bg-purple-300 text-white dark:text-purple-900 px-3 py-1 rounded-lg text-sm font-semibold">
            {selectedMood} Mood
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="devotional-title text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">
        {devotionalTitle}
      </h3>

      {/* Intro */}
      <p className="mb-4">{sections.intro}</p>

      {/* Scripture Section */}
      <div className="devotional-section scripture-section bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 border-l-8 border-l-indigo-900 dark:border-l-indigo-300 rounded-xl p-5 mb-4 shadow-lg shadow-indigo-600/30">
        <div className="devotional-section-header flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 mb-3">
          <span className="emoji-icon text-2xl">📖</span>
          <span>Scripture</span>
        </div>
        <p>{sections.scripture}</p>
      </div>

      {/* Reflection Section */}
      <div className="devotional-section bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-4">
        <div className="devotional-section-header flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 mb-3">
          <span className="emoji-icon text-2xl">💡</span>
          <span>Reflection</span>
        </div>
        <p>{sections.reflection}</p>
      </div>

      {/* Prayer Section */}
      <div className="devotional-section bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-4">
        <div className="devotional-section-header flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 mb-3">
          <span className="emoji-icon text-2xl">🙏</span>
          <span>Prayer</span>
        </div>
        <p>{sections.prayer}</p>
      </div>

      {/* Challenge Section */}
      <div className="devotional-section bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-4">
        <div className="devotional-section-header flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 mb-3">
          <span className="emoji-icon text-2xl">⭐</span>
          <span>Today&apos;s Challenge</span>
        </div>
        <p>{sections.challenge}</p>
      </div>

      {/* Share Buttons */}
      <ShareButtons title={devotionalTitle} content={shareContent} />

      {/* Action Buttons */}
      <div className="action-buttons flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={onGenerateAnother}
          className="generate-another-btn bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 border border-indigo-300 dark:border-indigo-600 px-6 py-3 rounded-xl font-semibold transition-all hover:bg-indigo-200 dark:hover:bg-indigo-800"
        >
          Generate Another
        </button>
        <button
          onClick={onPrint}
          className="print-btn bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-600 px-6 py-3 rounded-xl font-semibold transition-all hover:bg-green-200 dark:hover:bg-green-800"
        >
          Print Devotional
        </button>
        <PDFExport elementId="devotional-content" fileName={`${devotionalTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`} />
      </div>
    </div>
  );
}
