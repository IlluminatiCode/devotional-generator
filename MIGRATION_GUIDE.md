# Migration Guide: HTML/Express to Next.js 14+ with TypeScript

## Overview

This guide details the migration from the legacy HTML/Express application to a modern Next.js 14+ TypeScript application.

## Project Structure

### New Directory Structure

```
devotional-generator/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page component
│   ├── globals.css          # Global styles
│   └── api/                 # API routes (to be created)
│       └── generate/
│           └── route.ts     # Devotional generation endpoint
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── DevotionalForm.tsx   # Form for selecting options
│   ├── DevotionalOutput.tsx # Display generated devotional
│   └── ThemeCard.tsx        # Individual theme selection cards
├── lib/                     # Utility functions and configurations
│   ├── env.ts              # Environment variable validation (Zod)
│   ├── constants.ts        # Bible verses and constants
│   └── utils.ts            # Utility functions
├── types/                   # TypeScript type definitions
│   ├── devotional.ts       # Devotional-related types
│   └── index.ts            # Type exports
├── public/                  # Static assets
├── .env                     # Environment variables (gitignored)
├── .env.example            # Example environment variables
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js configuration
└── package.json            # Dependencies and scripts
```

## Migration Steps

### Phase 1: Component Conversion

#### 1.1 Convert HTML Structure to React Components

**Old (HTML):**
```html
<div id="theme-cards" class="card-grid">
  <div class="card" data-value="Patience">
    <span class="emoji-icon">⏳</span>
    Patience
  </div>
</div>
```

**New (React/TypeScript):**
```tsx
// components/ThemeCard.tsx
interface ThemeCardProps {
  theme: DevotionalTheme;
  emoji: string;
  isSelected: boolean;
  onSelect: (theme: DevotionalTheme) => void;
}

export function ThemeCard({ theme, emoji, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={() => onSelect(theme)}
      className={cn('card', { selected: isSelected })}
    >
      <span className="emoji-icon">{emoji}</span>
      {theme}
    </button>
  );
}
```

#### 1.2 Extract Inline Styles to Tailwind Classes

**Old (CSS in HTML):**
```css
.card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
}
```

**New (Tailwind):**
```tsx
<div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
```

### Phase 2: State Management

#### 2.1 Convert jQuery/Vanilla JS to React State

**Old (Vanilla JS):**
```javascript
let selectedTheme = '';
themeCardsContainer.addEventListener('click', (event) => {
  selectedTheme = card.dataset.value;
});
```

**New (React):**
```tsx
const [selectedTheme, setSelectedTheme] = useState<DevotionalTheme | null>(null);

const handleThemeSelect = (theme: DevotionalTheme) => {
  setSelectedTheme(theme);
};
```

### Phase 3: API Routes

#### 3.1 Convert Express Routes to Next.js API Routes

**Old (Express - server.js):**
```javascript
app.post('/api/generate', async (req, res) => {
  const { selectedTheme, selectedAudience, selectedMood } = req.body;
  // ... API logic
});
```

**New (Next.js App Router - app/api/generate/route.ts):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import type { DevotionalRequest } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: DevotionalRequest = await request.json();
    // ... API logic with proper TypeScript types
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate devotional' },
      { status: 500 }
    );
  }
}
```

### Phase 4: Environment Variables

#### 4.1 Use Zod for Validation

**Old (.env with dotenv):**
```javascript
require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;
```

**New (Zod validation - lib/env.ts):**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1).startsWith('AIza'),
});

export const env = envSchema.parse(process.env);
```

### Phase 5: Type Safety

#### 5.1 Create Type Definitions

Create comprehensive TypeScript interfaces for all data structures:

```typescript
// types/devotional.ts
export type DevotionalTheme = 'Patience' | 'Forgiveness' | /* ... */;

export interface DevotionalRequest {
  selectedTheme: DevotionalTheme;
  selectedAudience?: TargetAudience;
  selectedMood?: MoodType;
}
```

## Key Improvements

### TypeScript Benefits

1. **Type Safety**: Catch errors at compile time
2. **IntelliSense**: Better code completion and documentation
3. **Refactoring**: Safer refactoring with type checking
4. **Self-Documentation**: Types serve as inline documentation

### Next.js Benefits

1. **Server Components**: Better performance with RSC
2. **App Router**: Improved routing and layouts
3. **API Routes**: Integrated backend API
4. **Optimizations**: Built-in image/font optimization
5. **TypeScript-First**: First-class TypeScript support

### Code Quality

1. **ESLint**: Automated code quality checks
2. **Prettier**: Consistent code formatting
3. **Strict TypeScript**: Maximum type safety
4. **Component Reusability**: Better code organization

## Migration Checklist

- [x] Initialize Next.js 14+ project
- [x] Set up TypeScript with strict mode
- [x] Configure Tailwind CSS
- [x] Set up ESLint and Prettier
- [x] Create folder structure
- [x] Set up environment validation with Zod
- [ ] Create React components from HTML
- [ ] Convert Express API routes to Next.js API routes
- [ ] Implement state management with React hooks
- [ ] Migrate Bible verse data to constants
- [ ] Create reusable UI components
- [ ] Implement dark mode with next-themes
- [ ] Add loading states and error boundaries
- [ ] Test API integration with Gemini
- [ ] Add form validation
- [ ] Implement print functionality
- [ ] Deploy to Vercel

## Files to Migrate

### 1. devotional_generator.html
**Status**: To be converted to React components
**New Location**:
- `app/page.tsx` (main page)
- `components/DevotionalForm.tsx` (form)
- `components/DevotionalOutput.tsx` (output)
- `components/ui/ThemeCard.tsx` (cards)

### 2. server.js
**Status**: To be converted to API routes
**New Location**:
- `app/api/generate/route.ts` (POST endpoint)
- `lib/gemini.ts` (Gemini API client)
- `lib/constants.ts` (Bible verses)

### 3. vercel.json
**Status**: May need updates
**Action**: Review and update for Next.js deployment

## Running the Application

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Code Quality Checks
```bash
npm run validate  # Run type-check, lint, and format checks
npm run lint:fix  # Auto-fix ESLint issues
npm run format    # Format code with Prettier
```

## Next Steps

1. **Create API Route**: Implement `app/api/generate/route.ts`
2. **Build Components**: Create form and output components
3. **Add Interactivity**: Implement React hooks for state
4. **Style Components**: Apply Tailwind classes
5. **Test Integration**: Verify Gemini API works
6. **Add Features**: Dark mode, print, share
7. **Optimize**: Performance and SEO
8. **Deploy**: Push to Vercel

## Common Issues and Solutions

### Issue: Module not found
**Solution**: Check import paths use `@/` alias and match file structure

### Issue: Type errors
**Solution**: Ensure all types are properly defined in `types/` directory

### Issue: Environment variables not working
**Solution**: Verify `.env` file exists and variables are validated in `lib/env.ts`

### Issue: Tailwind classes not applying
**Solution**: Check `tailwind.config.ts` includes correct content paths

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
