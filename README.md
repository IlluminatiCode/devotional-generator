# Thematic Devotional Generator

A modern, type-safe Next.js 14+ application for generating personalized devotionals using Google's Gemini AI.

## Features

- **Next.js 14+ App Router**: Modern React framework with Server Components
- **TypeScript Strict Mode**: Enterprise-grade type safety
- **Tailwind CSS**: Utility-first styling with dark mode support
- **Zod Validation**: Runtime type validation for environment variables
- **ESLint + Prettier**: Code quality and formatting
- **Gemini AI Integration**: AI-powered devotional generation
- **Responsive Design**: Mobile-first design approach

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.9+ (Strict Mode)
- **Styling**: Tailwind CSS 4.x
- **Validation**: Zod
- **AI**: Google Gemini API
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
devotional-generator/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── api/                 # API routes
├── components/              # React components
│   └── ui/                  # Reusable UI components
├── lib/                     # Utilities and configs
│   ├── env.ts              # Environment validation
│   ├── constants.ts        # App constants
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript types
│   ├── devotional.ts       # Domain types
│   └── index.ts            # Type exports
├── public/                  # Static assets
└── ...config files         # Configuration files
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript compiler check |
| `npm run validate` | Run all checks (type, lint, format) |

## TypeScript Configuration

The project uses strict TypeScript configuration with the following key settings:

- `strict: true` - Enable all strict type-checking options
- `noUncheckedIndexedAccess: true` - Prevent unchecked array access
- `noImplicitReturns: true` - Ensure all code paths return
- `exactOptionalPropertyTypes: false` - Standard optional property behavior
- Path aliases configured with `@/*` for clean imports

## Development Workflow

### 1. Before Committing

Always run validation:
```bash
npm run validate
```

This runs:
- TypeScript type checking
- ESLint checks
- Prettier formatting checks

### 2. Auto-fix Issues

```bash
npm run lint:fix    # Fix lint issues
npm run format      # Format code
```

### 3. Type Safety

Always define types for:
- Component props
- Function parameters and return values
- API responses
- State variables

Example:
```typescript
interface ComponentProps {
  title: string;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function Component({ title, isActive, onSelect }: ComponentProps): React.JSX.Element {
  // Component implementation
}
```

## Code Style Guidelines

### TypeScript Best Practices

1. **Use type imports**
```typescript
import type { NextConfig } from 'next';
```

2. **Define explicit return types**
```typescript
function calculate(a: number, b: number): number {
  return a + b;
}
```

3. **Use readonly for immutable data**
```typescript
const THEMES: readonly string[] = ['Patience', 'Hope'];
```

4. **Avoid `any` - use `unknown` or proper types**
```typescript
// Bad
function process(data: any) { }

// Good
function process(data: unknown) {
  if (typeof data === 'string') {
    // Type-safe processing
  }
}
```

### Component Guidelines

1. **Use function declarations**
```typescript
export function MyComponent() { }  // Preferred
```

2. **Destructure props**
```typescript
export function Card({ title, description }: CardProps) { }
```

3. **Use proper TypeScript for events**
```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // Handler logic
};
```

### Styling Guidelines

1. **Use Tailwind classes**
2. **Use `cn()` utility for conditional classes**
```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-class', { 'active': isActive })} />
```

3. **Group classes logically**
```typescript
className="flex items-center gap-4 rounded-lg bg-white p-4"
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `NODE_ENV` | No | Environment (development/production) |
| `NEXT_PUBLIC_APP_URL` | No | Application URL |

Variables are validated at runtime using Zod. See `lib/env.ts` for schema.

## API Routes

### POST /api/generate

Generate a devotional based on user selections.

**Request Body:**
```typescript
{
  selectedTheme: DevotionalTheme;
  selectedAudience?: TargetAudience;
  selectedMood?: MoodType;
}
```

**Response:**
```typescript
{
  content: DevotionalSection;
  metadata: {
    theme: DevotionalTheme;
    audience?: TargetAudience;
    mood?: MoodType;
    generatedAt: string;
  };
}
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
vercel deploy
```

### Manual Deployment

```bash
npm run build
npm start
```

## Contributing

1. Follow TypeScript strict mode guidelines
2. Run `npm run validate` before committing
3. Use conventional commit messages
4. Update types when changing data structures

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with**: Next.js 14+, TypeScript, Tailwind CSS, and Gemini AI
