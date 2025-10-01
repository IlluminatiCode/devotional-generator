import type { DevotionalTheme } from '@/types';

/**
 * Bible verses organized by theme
 * Curated list of relevant scriptures for each devotional theme
 */
export const BIBLE_VERSES_BY_THEME: Record<DevotionalTheme, readonly string[]> = {
  Patience: [
    'Romans 8:25 - But if we hope for what we do not yet have, we wait for it patiently.',
    'Psalm 37:7 - Be still before the Lord and wait patiently for him.',
    'James 1:4 - Let perseverance finish its work so that you may be mature and complete.',
    'Galatians 6:9 - Let us not become weary in doing good, for at the proper time we will reap a harvest.',
    'Hebrews 10:36 - You need to persevere so that when you have done the will of God, you will receive what he has promised.',
  ],
  Forgiveness: [
    'Colossians 3:13 - Bear with each other and forgive one another. Forgive as the Lord forgave you.',
    'Matthew 6:14-15 - For if you forgive other people when they sin against you, your heavenly Father will also forgive you.',
    'Ephesians 4:32 - Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.',
  ],
  Leadership: [
    'Proverbs 11:14 - For lack of guidance a nation falls, but victory is won through many advisers.',
    '1 Peter 5:2-3 - Be shepherds of God flock that is under your care, watching over them.',
    'Matthew 20:26-28 - Whoever wants to become great among you must be your servant.',
  ],
  Hope: [
    'Jeremiah 29:11 - For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    'Romans 15:13 - May the God of hope fill you with all joy and peace as you trust in him.',
    'Psalm 62:5-6 - Yes, my soul, find rest in God; my hope comes from him.',
  ],
  Love: [
    '1 Corinthians 13:4-7 - Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
    'John 3:16 - For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    'Romans 5:8 - But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.',
  ],
  Faith: [
    'Hebrews 11:1 - Now faith is confidence in what we hope for and assurance about what we do not see.',
    'Romans 10:17 - Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.',
    'James 2:17 - In the same way, faith by itself, if it is not accompanied by action, is dead.',
  ],
  Gratitude: [
    '1 Thessalonians 5:18 - Give thanks in all circumstances; for this is God will for you in Christ Jesus.',
    'Psalm 107:1 - Give thanks to the Lord, for he is good; his love endures forever.',
    'Colossians 3:17 - And whatever you do, do it all in the name of the Lord Jesus, giving thanks to God the Father through him.',
  ],
  Courage: [
    'Joshua 1:9 - Have I not commanded you? Be strong and courageous. Do not be afraid.',
    'Deuteronomy 31:6 - Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you.',
    'Psalm 27:1 - The Lord is my light and my salvation. Whom shall I fear? The Lord is the stronghold of my life.',
  ],
  Wisdom: [
    'Proverbs 3:5-6 - Trust in the Lord with all your heart and lean not on your own understanding.',
    'James 1:5 - If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.',
    'Proverbs 4:6-7 - Do not forsake wisdom, and she will protect you; love her, and she will watch over you.',
  ],
  Joy: [
    'Psalm 16:11 - You make known to me the path of life; you will fill me with joy in your presence.',
    'Philippians 4:4 - Rejoice in the Lord always. I will say it again: Rejoice!',
    'Nehemiah 8:10 - Do not grieve, for the joy of the Lord is your strength.',
  ],
  Kindness: [
    'Ephesians 4:32 - Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.',
    'Proverbs 11:17 - A kind person benefits themselves, but a cruel person brings trouble on themselves.',
    'Colossians 3:12 - Clothe yourselves with compassion, kindness, humility, gentleness and patience.',
  ],
  Humility: [
    'Philippians 2:3-4 - Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.',
    'Proverbs 22:4 - Humility is the fear of the Lord; its wages are riches and honor and life.',
    'James 4:10 - Humble yourselves before the Lord, and he will lift you up.',
  ],
} as const;

/**
 * API configuration constants
 */
export const API_CONFIG = {
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000,
} as const;

/**
 * Devotional generation settings
 */
export const DEVOTIONAL_CONFIG = {
  MIN_WORD_COUNT: 200,
  MAX_WORD_COUNT: 300,
  VERSE_COUNT: 2,
} as const;

/**
 * UI Card Options for Theme Selection
 * Using Lucide icon names for professional appearance
 */
export const THEME_OPTIONS = [
  { value: 'Patience', icon: 'Clock', label: 'Patience' },
  { value: 'Forgiveness', icon: 'Heart', label: 'Forgiveness' },
  { value: 'Leadership', icon: 'Crown', label: 'Leadership' },
  { value: 'Hope', icon: 'Sparkles', label: 'Hope' },
  { value: 'Love', icon: 'HeartHandshake', label: 'Love' },
  { value: 'Faith', icon: 'Church', label: 'Faith' },
  { value: 'Gratitude', icon: 'Smile', label: 'Gratitude' },
  { value: 'Courage', icon: 'Shield', label: 'Courage' },
  { value: 'Wisdom', icon: 'BookOpen', label: 'Wisdom' },
  { value: 'Joy', icon: 'PartyPopper', label: 'Joy' },
  { value: 'Kindness', icon: 'HandHeart', label: 'Kindness' },
  { value: 'Humility', icon: 'UserCheck', label: 'Humility' },
  { value: 'Peace', icon: 'Waves', label: 'Peace' },
  { value: 'Trust', icon: 'Handshake', label: 'Trust' },
  { value: 'Perseverance', icon: 'Mountain', label: 'Perseverance' },
  { value: 'Compassion', icon: 'HeartPulse', label: 'Compassion' },
  { value: 'Faithfulness', icon: 'Star', label: 'Faithfulness' },
  { value: 'Grace', icon: 'Gift', label: 'Grace' },
  { value: 'Mercy', icon: 'Droplets', label: 'Mercy' },
  { value: 'Obedience', icon: 'CheckCircle', label: 'Obedience' },
  { value: 'Worship', icon: 'Music', label: 'Worship' },
  { value: 'Service', icon: 'HandHelping', label: 'Service' },
  { value: 'Sacrifice', icon: 'Flame', label: 'Sacrifice' },
  { value: 'Purpose', icon: 'Target', label: 'Purpose' },
] as const;

/**
 * UI Card Options for Audience Selection
 * Using Lucide icon names for professional appearance
 */
export const AUDIENCE_OPTIONS = [
  { value: '', icon: 'Users', label: 'General' },
  { value: 'Youth', icon: 'GraduationCap', label: 'Youth' },
  { value: 'Parents', icon: 'Home', label: 'Parents' },
  { value: 'Leaders', icon: 'Briefcase', label: 'Leaders' },
  { value: 'Students', icon: 'BookMarked', label: 'Students' },
  { value: 'Couples', icon: 'HeartHandshake', label: 'Couples' },
  { value: 'Singles', icon: 'User', label: 'Singles' },
  { value: 'Professionals', icon: 'Building2', label: 'Professionals' },
  { value: 'Seniors', icon: 'Armchair', label: 'Seniors' },
  { value: 'Children', icon: 'Baby', label: 'Children' },
  { value: 'Teenagers', icon: 'Smartphone', label: 'Teenagers' },
  { value: 'Ministers', icon: 'Church', label: 'Ministers' },
  { value: 'New Believers', icon: 'Sprout', label: 'New Believers' },
  { value: 'Seekers', icon: 'Search', label: 'Seekers' },
  { value: 'Caregivers', icon: 'HeartPulse', label: 'Caregivers' },
] as const;

/**
 * UI Card Options for Mood Selection
 * Using Lucide icon names for professional appearance
 */
export const MOOD_OPTIONS = [
  { value: '', icon: 'Minus', label: 'Neutral' },
  { value: 'Anxious', icon: 'CloudLightning', label: 'Anxious' },
  { value: 'Grateful', icon: 'Smile', label: 'Grateful' },
  { value: 'Lost', icon: 'HelpCircle', label: 'Lost' },
  { value: 'Confused', icon: 'BrainCircuit', label: 'Confused' },
  { value: 'Doubting', icon: 'AlertCircle', label: 'Doubting' },
  { value: 'Joyful', icon: 'PartyPopper', label: 'Joyful' },
  { value: 'Stressed', icon: 'ZapOff', label: 'Stressed' },
  { value: 'Peaceful', icon: 'Waves', label: 'Peaceful' },
  { value: 'Hopeful', icon: 'Sunrise', label: 'Hopeful' },
  { value: 'Overwhelmed', icon: 'Zap', label: 'Overwhelmed' },
  { value: 'Broken', icon: 'HeartCrack', label: 'Broken' },
  { value: 'Discouraged', icon: 'TrendingDown', label: 'Discouraged' },
  { value: 'Inspired', icon: 'Lightbulb', label: 'Inspired' },
  { value: 'Weary', icon: 'Loader', label: 'Weary' },
] as const;
