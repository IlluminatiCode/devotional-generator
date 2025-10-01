# TypeScript Best Practices for Devotional Generator

## Table of Contents
1. [Type Safety Principles](#type-safety-principles)
2. [Component Types](#component-types)
3. [Advanced Typing Patterns](#advanced-typing-patterns)
4. [Error Handling](#error-handling)
5. [Performance Considerations](#performance-considerations)

## Type Safety Principles

### 1. Avoid `any` at All Costs

```typescript
// Bad - Defeats the purpose of TypeScript
function processData(data: any): any {
  return data.value;
}

// Good - Use proper types
function processData(data: DevotionalRequest): DevotionalResponse {
  return {
    content: parseContent(data),
    metadata: buildMetadata(data),
  };
}

// Good - Use unknown when type is truly unknown
function processUnknownData(data: unknown): string {
  if (isDevotionalRequest(data)) {
    return data.selectedTheme;
  }
  throw new Error('Invalid data structure');
}
```

### 2. Use Type Guards

```typescript
// Type guard function
function isDevotionalTheme(value: unknown): value is DevotionalTheme {
  const validThemes: readonly string[] = [
    'Patience', 'Forgiveness', 'Leadership', 'Hope',
    'Love', 'Faith', 'Gratitude', 'Courage',
    'Wisdom', 'Joy', 'Kindness', 'Humility'
  ];
  return typeof value === 'string' && validThemes.includes(value);
}

// Usage
function processTheme(theme: unknown): void {
  if (isDevotionalTheme(theme)) {
    // TypeScript knows theme is DevotionalTheme here
    console.log(`Processing ${theme}`);
  } else {
    throw new Error('Invalid theme');
  }
}
```

### 3. Use Discriminated Unions

```typescript
// Discriminated union for API responses
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Type-safe handling
function handleResponse<T>(response: ApiResponse<T>): T {
  if (response.success) {
    // TypeScript knows response.data exists
    return response.data;
  } else {
    // TypeScript knows response.error exists
    throw new Error(response.error);
  }
}
```

## Component Types

### 1. React Component Props

```typescript
// Always define prop interfaces
interface ButtonProps {
  readonly variant: 'primary' | 'secondary';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly disabled?: boolean;
  readonly onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly children: React.ReactNode;
}

export function Button({
  variant,
  size = 'md',
  disabled = false,
  onClick,
  children,
}: ButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(styles[variant], styles[size])}
    >
      {children}
    </button>
  );
}
```

### 2. Generic Components

```typescript
// Generic component for reusable card
interface CardProps<T> {
  readonly data: T;
  readonly onSelect: (item: T) => void;
  readonly renderContent: (item: T) => React.ReactNode;
}

export function Card<T extends { id: string }>({
  data,
  onSelect,
  renderContent,
}: CardProps<T>): React.JSX.Element {
  return (
    <div onClick={() => onSelect(data)}>
      {renderContent(data)}
    </div>
  );
}

// Usage
<Card<DevotionalTheme>
  data={theme}
  onSelect={handleThemeSelect}
  renderContent={(t) => <span>{t}</span>}
/>
```

### 3. Event Handlers

```typescript
// Proper event handler typing
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault();
  // Handler logic
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  const value = event.target.value;
  // Change logic
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
  // Submit logic
};
```

## Advanced Typing Patterns

### 1. Utility Types

```typescript
// Make all properties optional
type PartialDevotional = Partial<DevotionalSection>;

// Make all properties required
type RequiredDevotional = Required<DevotionalSection>;

// Pick specific properties
type DevotionalMeta = Pick<DevotionalSection, 'title' | 'intro'>;

// Omit specific properties
type DevotionalWithoutScripture = Omit<DevotionalSection, 'scripture'>;

// Make properties readonly
type ReadonlyDevotional = Readonly<DevotionalSection>;
```

### 2. Mapped Types

```typescript
// Create a type with all string values
type DevotionalErrors = {
  [K in keyof DevotionalSection]: string;
};

// Conditional mapped type
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableDevotional = Nullable<DevotionalSection>;
```

### 3. Template Literal Types

```typescript
// Create type-safe string patterns
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint = '/api/generate' | '/api/themes';
type ApiRoute = `${HttpMethod} ${ApiEndpoint}`;

// Usage
const route: ApiRoute = 'POST /api/generate'; // Valid
const invalid: ApiRoute = 'PATCH /api/generate'; // Error
```

### 4. Conditional Types

```typescript
// Conditional type based on input
type ResponseType<T extends boolean> = T extends true
  ? DevotionalResponse
  : ApiErrorResponse;

function fetchData<T extends boolean>(
  success: T
): ResponseType<T> {
  if (success) {
    return { content: {}, metadata: {} } as ResponseType<T>;
  }
  return { error: { message: 'Failed' } } as ResponseType<T>;
}
```

### 5. Branded Types

```typescript
// Create unique types for primitive values
type Brand<K, T> = K & { __brand: T };
type DevotionalId = Brand<string, 'DevotionalId'>;
type UserId = Brand<string, 'UserId'>;

// Type-safe ID handling
function getDevotional(id: DevotionalId): Devotional {
  // Implementation
}

// This works
const devotionalId = 'abc' as DevotionalId;
getDevotional(devotionalId);

// This fails at compile time
const userId = 'xyz' as UserId;
// getDevotional(userId); // Error: Type 'UserId' is not assignable to 'DevotionalId'
```

## Error Handling

### 1. Type-Safe Error Classes

```typescript
// Custom error classes with proper typing
class DevotionalError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'DevotionalError';
  }
}

class ValidationError extends DevotionalError {
  constructor(message: string, public readonly field: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

// Type-safe error handling
function handleError(error: unknown): ApiErrorResponse {
  if (error instanceof ValidationError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        field: error.field,
      },
    };
  }

  if (error instanceof DevotionalError) {
    return {
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  if (error instanceof Error) {
    return {
      error: {
        message: error.message,
        code: 'UNKNOWN_ERROR',
      },
    };
  }

  return {
    error: {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN',
    },
  };
}
```

### 2. Result Type Pattern

```typescript
// Result type for operations that can fail
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// Type-safe result handling
async function generateDevotional(
  request: DevotionalRequest
): Promise<Result<DevotionalResponse, ValidationError>> {
  try {
    // Validation
    if (!request.selectedTheme) {
      return {
        success: false,
        error: new ValidationError('Theme is required', 'selectedTheme'),
      };
    }

    // Generation logic
    const response = await callGeminiApi(request);

    return { success: true, value: response };
  } catch (error) {
    return {
      success: false,
      error: new ValidationError('Generation failed', 'unknown'),
    };
  }
}

// Usage
const result = await generateDevotional(request);
if (result.success) {
  console.log(result.value); // DevotionalResponse
} else {
  console.error(result.error); // ValidationError
}
```

## Performance Considerations

### 1. Const Assertions

```typescript
// Use const assertion for immutable data
const THEMES = [
  'Patience',
  'Forgiveness',
  'Leadership',
] as const; // Type: readonly ["Patience", "Forgiveness", "Leadership"]

// Infer type from const assertion
type Theme = typeof THEMES[number]; // Type: "Patience" | "Forgiveness" | "Leadership"
```

### 2. Type-Only Imports

```typescript
// Import only types (removed at compile time)
import type { DevotionalTheme } from '@/types';

// Import value and type separately
import { processTheme } from '@/lib/devotional';
import type { ThemeConfig } from '@/lib/devotional';
```

### 3. Lazy Type Evaluation

```typescript
// Use type aliases for complex types
type ComplexType = Omit<DevotionalSection, 'scripture'> & {
  additionalField: string;
};

// Reference the alias instead of repeating
function process(data: ComplexType): void {
  // Implementation
}
```

## Configuration Best Practices

### 1. Strict TSConfig Settings

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false,
    "noImplicitReturns": true
  }
}
```

### 2. ESLint TypeScript Rules

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }]
  }
}
```

## Testing Types

### 1. Type Testing with Conditional Types

```typescript
// Helper types for testing
type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;

// Type tests
type Test1 = Expect<Equal<DevotionalTheme, 'Patience' | 'Hope' | /* ... */>>;
type Test2 = Expect<Equal<keyof DevotionalSection, 'title' | 'intro' | /* ... */>>;
```

## Summary

1. **Always prefer type safety over convenience**
2. **Use discriminated unions for complex states**
3. **Leverage TypeScript's utility types**
4. **Create custom type guards for runtime validation**
5. **Use const assertions for immutable data**
6. **Implement proper error handling with types**
7. **Use generics for reusable, type-safe code**
8. **Keep types close to their usage**
9. **Document complex types with JSDoc**
10. **Run type checks as part of CI/CD**
