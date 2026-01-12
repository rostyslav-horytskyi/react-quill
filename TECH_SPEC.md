# Technical Specification: Advanced Rich Text Engine (Quill Customization)

## Overview

### Project Purpose

This is a **portfolio demonstration project** showcasing advanced Quill editor customization capabilities. The project demonstrates:

- **Deep DOM manipulation** - Custom rendering and DOM structure management
- **Library extension** - Extending Quill with custom Blots and modules
- **Data structures** - Working with Delta format for content representation
- **React integration** - Proper patterns for integrating imperative libraries with React

### What We're Building

A rich text editor with **10 custom Blots** that go beyond standard text formatting:

| # | Blot | Description | Complexity |
|---|------|-------------|------------|
| 1 | Product Card | Embedded product with image, price, CTA button | High |
| 2 | Mention | @user references with autocomplete dropdown | Medium |
| 3 | Interactive Checklist | Toggleable checkboxes with persistent state | Medium |
| 4 | Alert/Callout | Info, warning, error, success message blocks | Low |
| 5 | Code Block (Enhanced) | Syntax highlighting with language selector | Medium |
| 6 | Embed (Video/Social) | YouTube, Twitter, custom embed support | Medium |
| 7 | Table (Enhanced) | Resizable columns, basic cell operations | High |
| 8 | Collapsible/Accordion | Expandable content sections | Medium |
| 9 | Divider | Styled horizontal rules with variants | Low |
| 10 | AI Assistant | "Ask Copilot" inline text editing | High |

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool |
| TypeScript | 5.x | Type safety |
| Quill | 2.x | Rich text engine |
| Tailwind CSS | 4.x | Utility-first styling |
| SCSS | 1.x | Custom component styles |
| ESLint | 9.x | Code linting |
| Prettier | 3.x | Code formatting |
| GitHub Actions | - | CI/CD pipeline |

### Core Concepts

This implementation is based on the [official Quill React playground](https://quilljs.com/playground/react) patterns and best practices.

## Architecture

### Design Pattern: Uncontrolled Component with ForwardRef

The implementation follows an **uncontrolled component pattern** using `forwardRef`. This approach:
- Gives direct access to the Quill instance via ref
- Avoids React state synchronization issues with the editor's internal state
- Provides optimal performance by not re-rendering on every keystroke
- Aligns with Quill's imperative API design

```
┌─────────────────────────────────────────────────────────┐
│                        App                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │                    Editor                         │  │
│  │  ┌─────────────┐    ┌─────────────────────────┐   │  │
│  │  │  Toolbar    │    │     Editor Container    │   │  │
│  │  │  (optional) │    │   ┌─────────────────┐   │   │  │
│  │  └─────────────┘    │   │  Quill Instance │   │   │  │
│  │                     │   └─────────────────┘   │   │  │
│  │                     └─────────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Component Structure

### File Organization

```
src/
├── components/
│   ├── Editor/
│   │   ├── index.ts              # Public exports
│   │   ├── Editor.tsx            # Main editor component
│   │   ├── Editor.scss           # Editor-specific styles
│   │   └── types.ts              # TypeScript interfaces
│   ├── ThemeProvider/
│   │   ├── index.ts              # Theme context exports
│   │   ├── ThemeProvider.tsx     # Dark/light theme provider
│   │   └── useTheme.ts           # Theme hook
│   └── ui/                       # Shared UI components
│       ├── Button.tsx
│       ├── Dropdown.tsx
│       └── Modal.tsx
├── blots/                        # Custom Quill Blots
│   ├── index.ts                  # Register all blots
│   ├── ProductCardBlot.ts        # Product card embed
│   ├── MentionBlot.ts            # @mention inline
│   ├── ChecklistBlot.ts          # Interactive checklist
│   ├── AlertBlot.ts              # Alert/callout blocks
│   ├── CodeBlockBlot.ts          # Enhanced code block
│   ├── EmbedBlot.ts              # Video/social embeds
│   ├── TableBlot.ts              # Enhanced table
│   ├── CollapsibleBlot.ts        # Accordion sections
│   ├── DividerBlot.ts            # Styled dividers
│   └── AIAssistantBlot.ts        # Ask Copilot feature
├── modules/                      # Custom Quill Modules
│   ├── index.ts                  # Register all modules
│   ├── MentionModule.ts          # Autocomplete for mentions
│   ├── AIAssistantModule.ts      # AI text editing module
│   └── ToolbarModule.ts          # Custom toolbar handlers
├── styles/                       # Global styles
│   ├── index.scss                # Main SCSS entry point
│   ├── _variables.scss           # SCSS variables & CSS custom properties
│   ├── _mixins.scss              # Reusable SCSS mixins
│   ├── _quill-overrides.scss     # Quill theme customizations
│   ├── _blots.scss               # Custom blot styles
│   └── _dark-theme.scss          # Dark mode styles
├── hooks/
│   ├── useQuill.ts               # Quill instance hook
│   ├── useAutoSave.ts            # Auto-save functionality
│   ├── useTheme.ts               # Theme toggle hook
│   └── useMentions.ts            # Mention suggestions hook
├── utils/
│   ├── delta.ts                  # Delta helper utilities
│   ├── blotUtils.ts              # Blot creation helpers
│   └── aiService.ts              # AI API integration (mock/real)
├── types/
│   ├── blots.ts                  # Blot data interfaces
│   ├── editor.ts                 # Editor types
│   └── ai.ts                     # AI service types
├── App.tsx
├── main.tsx
└── index.css                     # Tailwind directives (imports SCSS)

# Root config files
├── .eslintrc.cjs                 # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .prettierignore               # Prettier ignore patterns
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── vite.config.ts                # Vite configuration
└── .github/
    └── workflows/
        └── ci.yml                # GitHub Actions CI/CD
```

---

## Development Setup

### ESLint Configuration

```bash
# Install ESLint with TypeScript and React plugins
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
```

```javascript
// eslint.config.js

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }
);
```

---

### Prettier Configuration

```bash
# Install Prettier
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "plugins": []
}
```

```text
# .prettierignore
dist
node_modules
*.min.js
*.min.css
coverage
.github
package-lock.json
```

---

### SCSS Setup

```bash
# Install SCSS support for Vite
npm install -D sass
```

#### SCSS Variables & Theme

```scss
// src/styles/_variables.scss

// Colors - Light Theme
$color-primary: #3b82f6;
$color-primary-hover: #2563eb;
$color-secondary: #6b7280;
$color-success: #10b981;
$color-warning: #f59e0b;
$color-error: #ef4444;
$color-info: #3b82f6;

// Light theme colors
$light-bg: #ffffff;
$light-bg-secondary: #f9fafb;
$light-text: #111827;
$light-text-secondary: #6b7280;
$light-border: #e5e7eb;

// Dark theme colors
$dark-bg: #1f2937;
$dark-bg-secondary: #111827;
$dark-text: #f9fafb;
$dark-text-secondary: #9ca3af;
$dark-border: #374151;

// CSS Custom Properties for runtime theming
:root {
  --color-primary: #{$color-primary};
  --color-primary-hover: #{$color-primary-hover};
  --color-success: #{$color-success};
  --color-warning: #{$color-warning};
  --color-error: #{$color-error};
  --color-info: #{$color-info};

  // Light theme (default)
  --bg-primary: #{$light-bg};
  --bg-secondary: #{$light-bg-secondary};
  --text-primary: #{$light-text};
  --text-secondary: #{$light-text-secondary};
  --border-color: #{$light-border};
}

// Dark theme
[data-theme='dark'] {
  --bg-primary: #{$dark-bg};
  --bg-secondary: #{$dark-bg-secondary};
  --text-primary: #{$dark-text};
  --text-secondary: #{$dark-text-secondary};
  --border-color: #{$dark-border};
}

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Border radius
$radius-sm: 0.25rem;
$radius-md: 0.375rem;
$radius-lg: 0.5rem;
$radius-xl: 0.75rem;

// Transitions
$transition-fast: 150ms ease;
$transition-normal: 200ms ease;
$transition-slow: 300ms ease;

// Z-index layers
$z-dropdown: 100;
$z-modal: 200;
$z-tooltip: 300;
$z-ai-toolbar: 400;
```

#### SCSS Mixins

```scss
// src/styles/_mixins.scss

@use 'variables' as *;

// Flexbox shortcuts
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Theme-aware background
@mixin themed-bg($light, $dark) {
  background-color: $light;
  [data-theme='dark'] & {
    background-color: $dark;
  }
}

// Theme-aware text
@mixin themed-text($light, $dark) {
  color: $light;
  [data-theme='dark'] & {
    color: $dark;
  }
}

// Theme-aware border
@mixin themed-border($light, $dark) {
  border-color: $light;
  [data-theme='dark'] & {
    border-color: $dark;
  }
}

// Button variants
@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all $transition-fast;
  cursor: pointer;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@mixin button-primary {
  @include button-base;
  background-color: var(--color-primary);
  color: white;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }
}

@mixin button-secondary {
  @include button-base;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  &:hover:not(:disabled) {
    background-color: var(--border-color);
  }
}

// Card/Panel
@mixin card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $radius-lg;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

// Responsive breakpoints
@mixin mobile {
  @media (max-width: 640px) {
    @content;
  }
}

@mixin tablet {
  @media (max-width: 1024px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: 1025px) {
    @content;
  }
}
```

#### Main SCSS Entry Point

```scss
// src/styles/index.scss

@use 'variables';
@use 'mixins';
@use 'quill-overrides';
@use 'blots';
@use 'dark-theme';

// Base styles
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  line-height: 1.5;
  transition: background-color variables.$transition-normal, color variables.$transition-normal;
}
```

#### Vite SCSS Configuration

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables" as *;
          @use "@/styles/mixins" as *;
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,scss,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,scss,css,json}\"",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint && npm run format:check"
  }
}
```

---

## GitHub Actions CI/CD

### CI Workflow

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  validate:
    name: Validate Code
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Build
        run: npm run build

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: validate

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test --if-present

  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: [validate, test]
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      # Add Vercel/Netlify preview deployment here
      # - name: Deploy to Vercel Preview
      #   uses: amondnet/vercel-action@v25
      #   with:
      #     vercel-token: ${{ secrets.VERCEL_TOKEN }}
      #     vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
      #     vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: [validate, test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      # Add production deployment here
      # - name: Deploy to Vercel Production
      #   uses: amondnet/vercel-action@v25
      #   with:
      #     vercel-token: ${{ secrets.VERCEL_TOKEN }}
      #     vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
      #     vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      #     vercel-args: '--prod'
```

### GitHub CLI Commands

```bash
# Check workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch a run in real-time
gh run watch

# Re-run failed jobs
gh run rerun <run-id> --failed

# View workflow logs
gh run view <run-id> --log

# Create PR with checks
gh pr create --title "Feature: Add custom blot" --body "Description" --draft

# Check PR status
gh pr checks
```

---

## Dark Theme Implementation

### Theme Context

```typescript
// src/components/ThemeProvider/ThemeProvider.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'quill-editor-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      root.classList.toggle('dark', isDark);
      setResolvedTheme(isDark ? 'dark' : 'light');
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### Theme Toggle Component

```typescript
// src/components/ui/ThemeToggle.tsx

import { useTheme } from '../ThemeProvider';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {resolvedTheme === 'dark' ? (
        <span className="text-xl">☀️</span>
      ) : (
        <span className="text-xl">🌙</span>
      )}
    </button>
  );
}
```

### Quill Dark Theme Styles

```scss
// src/styles/_dark-theme.scss

@use 'variables' as *;

// Dark theme Quill overrides
[data-theme='dark'] {
  // Snow theme
  .ql-snow {
    .ql-toolbar {
      background-color: $dark-bg-secondary;
      border-color: $dark-border;

      button {
        color: $dark-text-secondary;

        &:hover {
          color: $dark-text;
        }

        &.ql-active {
          color: $color-primary;
        }
      }

      .ql-stroke {
        stroke: $dark-text-secondary;
      }

      .ql-fill {
        fill: $dark-text-secondary;
      }

      button:hover .ql-stroke,
      button.ql-active .ql-stroke {
        stroke: $color-primary;
      }

      button:hover .ql-fill,
      button.ql-active .ql-fill {
        fill: $color-primary;
      }

      .ql-picker {
        color: $dark-text-secondary;

        &-label {
          color: $dark-text-secondary;

          &:hover {
            color: $dark-text;
          }
        }

        &-options {
          background-color: $dark-bg;
          border-color: $dark-border;
        }

        &-item {
          color: $dark-text-secondary;

          &:hover {
            color: $dark-text;
            background-color: $dark-bg-secondary;
          }
        }
      }
    }

    .ql-container {
      background-color: $dark-bg;
      border-color: $dark-border;
      color: $dark-text;
    }

    .ql-editor {
      color: $dark-text;

      &.ql-blank::before {
        color: $dark-text-secondary;
      }

      // Code blocks in dark mode
      pre.ql-syntax {
        background-color: lighten($dark-bg-secondary, 5%);
        border: 1px solid $dark-border;
      }

      // Blockquote in dark mode
      blockquote {
        border-left-color: $dark-border;
        color: $dark-text-secondary;
      }

      // Links in dark mode
      a {
        color: lighten($color-primary, 10%);
      }
    }
  }

  // Bubble theme
  .ql-bubble {
    .ql-tooltip {
      background-color: $dark-bg-secondary;
      border-color: $dark-border;
      color: $dark-text;

      &-arrow {
        border-bottom-color: $dark-bg-secondary;
      }
    }
  }

  // Custom blots dark mode
  .ql-product-card {
    background-color: $dark-bg-secondary;
    border-color: $dark-border;
  }

  .ql-alert {
    &.alert-info {
      background-color: rgba($color-info, 0.15);
    }
    &.alert-warning {
      background-color: rgba($color-warning, 0.15);
    }
    &.alert-error {
      background-color: rgba($color-error, 0.15);
    }
    &.alert-success {
      background-color: rgba($color-success, 0.15);
    }
  }

  .ql-code-block-enhanced {
    pre {
      background-color: lighten($dark-bg-secondary, 3%);
    }
  }

  .ql-collapsible {
    background-color: $dark-bg-secondary;
    border-color: $dark-border;
  }

  .ql-enhanced-table {
    th {
      background-color: $dark-bg-secondary;
    }
    td,
    th {
      border-color: $dark-border;
    }
  }

  // AI toolbar dark mode
  .ai-toolbar {
    background-color: $dark-bg;
    border-color: $dark-border;

    .ai-btn:hover {
      background-color: $dark-bg-secondary;
    }
  }
}
```

### Using Theme in App

```tsx
// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './components/ThemeProvider';
import App from './App';
import './styles/index.scss';
import './index.css'; // Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

```tsx
// src/App.tsx (updated header)

import { ThemeToggle } from './components/ui/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            React Quill Editor
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Other controls */}
          </div>
        </div>
      </header>
      {/* ... */}
    </div>
  );
}
```

---

## Core Implementation

### Editor Component Interface

```typescript
// src/components/Editor/types.ts

import type Quill from 'quill';
import type { Delta } from 'quill/core';

export interface EditorProps {
  /** Initial content as Delta */
  defaultValue?: Delta;
  /** Read-only mode */
  readOnly?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Theme: 'snow' | 'bubble' */
  theme?: 'snow' | 'bubble';
  /** Additional Tailwind classes */
  className?: string;
  /** Callback when text changes */
  onTextChange?: (delta: Delta, oldDelta: Delta, source: string) => void;
  /** Callback when selection changes */
  onSelectionChange?: (range: Range | null, oldRange: Range | null, source: string) => void;
  /** Callback when editor is ready */
  onReady?: (quill: Quill) => void;
}

export interface Range {
  index: number;
  length: number;
}
```

### Editor Component Implementation

```typescript
// src/components/Editor/Editor.tsx

import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import type { EditorProps } from './types';

const Editor = forwardRef<Quill | null, EditorProps>(
  (
    {
      defaultValue,
      readOnly = false,
      placeholder = '',
      theme = 'snow',
      onTextChange,
      onSelectionChange,
      onReady,
      className = '',
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const onReadyRef = useRef(onReady);

    // Keep callback refs in sync (before paint)
    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
      onReadyRef.current = onReady;
    });

    // Initialize Quill instance
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Create editor container element
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div')
      );

      // Initialize Quill
      const quill = new Quill(editorContainer, {
        theme,
        placeholder,
        readOnly,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean'],
          ],
        },
      });

      // Set ref
      if (typeof ref === 'function') {
        ref(quill);
      } else if (ref) {
        ref.current = quill;
      }

      // Set initial content
      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      // Attach event listeners
      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      // Notify ready
      onReadyRef.current?.(quill);

      // Cleanup
      return () => {
        if (typeof ref === 'function') {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }
        container.innerHTML = '';
      };
    }, [ref, theme, placeholder]);

    // Handle readOnly changes
    useEffect(() => {
      if (typeof ref === 'object' && ref?.current) {
        ref.current.enable(!readOnly);
      }
    }, [ref, readOnly]);

    return (
      <div
        ref={containerRef}
        className={`flex flex-col h-96 ${className}`}
      />
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;
```

## Key Implementation Details

### 1. Ref Pattern for Callbacks

Use `useRef` to store callbacks to prevent stale closures:

```typescript
const onTextChangeRef = useRef(onTextChange);

useLayoutEffect(() => {
  onTextChangeRef.current = onTextChange;
});
```

**Why**: React's `useEffect` captures variables at creation time. Without refs, event handlers would reference stale callback versions.

### 2. Dynamic Container Creation

Create the editor container dynamically within the effect:

```typescript
const editorContainer = container.appendChild(
  container.ownerDocument.createElement('div')
);
```

**Why**: Quill modifies DOM directly. Creating the container in the effect ensures proper cleanup and prevents React reconciliation conflicts.

### 3. Cleanup on Unmount

```typescript
return () => {
  if (typeof ref === 'function') {
    ref(null);
  } else if (ref) {
    ref.current = null;
  }
  container.innerHTML = '';
};
```

**Why**: Prevents memory leaks and ensures clean state if component remounts.

### 4. ReadOnly State Management

Handle `readOnly` changes in a separate effect:

```typescript
useEffect(() => {
  ref.current?.enable(!readOnly);
}, [ref, readOnly]);
```

**Why**: Allows toggling read-only state without reinitializing the editor.

## Toolbar Configuration

### Default Toolbar (Snow Theme)

```typescript
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],
  ['clean'],
];
```

### Minimal Toolbar

```typescript
const minimalToolbar = [
  ['bold', 'italic', 'underline'],
  ['link'],
];
```

### Custom Toolbar (HTML-based)

```tsx
// In parent component
<div id="toolbar">
  <button className="ql-bold" />
  <button className="ql-italic" />
  <select className="ql-size">
    <option value="small" />
    <option selected />
    <option value="large" />
    <option value="huge" />
  </select>
</div>

// Editor config
modules: {
  toolbar: '#toolbar'
}
```

## Custom Blots Architecture

### Understanding Quill Blots

Blots are the building blocks of Quill's document model. Every piece of content in Quill is represented by a Blot.

```
Quill Document Model
├── Block Blots (block-level elements)
│   ├── Paragraph, Header, List, Blockquote
│   └── Custom: Alert, Checklist, Collapsible, Table
├── Inline Blots (inline elements)
│   ├── Bold, Italic, Link
│   └── Custom: Mention, AI Assistant
└── Embed Blots (void/atomic elements)
    ├── Image, Video
    └── Custom: Product Card, Divider, Social Embed
```

### Blot Types

| Type | Base Class | Use Case | Content |
|------|------------|----------|---------|
| **Block** | `BlockEmbed` | Full-width elements | Contains other blots |
| **Inline** | `Inline` | Text-level formatting | Wraps text |
| **Embed** | `Embed` | Atomic/void elements | Self-contained, no children |

### Base Blot Implementation Pattern

```typescript
// src/blots/base/CustomBlot.ts

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

interface BlotData {
  id: string;
  // ... custom properties
}

class CustomBlot extends BlockEmbed {
  static blotName = 'custom-blot';
  static tagName = 'div';
  static className = 'ql-custom-blot';

  // Create DOM from data
  static create(data: BlotData): HTMLElement {
    const node = super.create() as HTMLElement;
    node.setAttribute('data-id', data.id);
    // Build DOM structure
    return node;
  }

  // Extract data from DOM (for Delta)
  static value(node: HTMLElement): BlotData {
    return {
      id: node.getAttribute('data-id') || '',
    };
  }

  // Format method for updates
  static formats(node: HTMLElement): BlotData {
    return CustomBlot.value(node);
  }
}

export default CustomBlot;
```

### Registering Blots

```typescript
// src/blots/index.ts

import Quill from 'quill';

// Import all custom blots
import ProductCardBlot from './ProductCardBlot';
import MentionBlot from './MentionBlot';
import ChecklistBlot from './ChecklistBlot';
import AlertBlot from './AlertBlot';
import CodeBlockBlot from './CodeBlockBlot';
import EmbedBlot from './EmbedBlot';
import TableBlot from './TableBlot';
import CollapsibleBlot from './CollapsibleBlot';
import DividerBlot from './DividerBlot';
import AIAssistantBlot from './AIAssistantBlot';

// Register all blots
export function registerBlots() {
  Quill.register(ProductCardBlot);
  Quill.register(MentionBlot);
  Quill.register(ChecklistBlot);
  Quill.register(AlertBlot);
  Quill.register(CodeBlockBlot, true); // Override default
  Quill.register(EmbedBlot);
  Quill.register(TableBlot, true); // Override default
  Quill.register(CollapsibleBlot);
  Quill.register(DividerBlot);
  Quill.register(AIAssistantBlot);
}

// Export individual blots for direct use
export {
  ProductCardBlot,
  MentionBlot,
  ChecklistBlot,
  AlertBlot,
  CodeBlockBlot,
  EmbedBlot,
  TableBlot,
  CollapsibleBlot,
  DividerBlot,
  AIAssistantBlot,
};
```

---

## Custom Blots Implementation

### 1. Product Card Blot

Embeddable product card with image, title, price, and CTA button.

```typescript
// src/blots/ProductCardBlot.ts

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  description?: string;
}

class ProductCardBlot extends BlockEmbed {
  static blotName = 'product-card';
  static tagName = 'div';
  static className = 'ql-product-card';

  static create(data: ProductCardData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-id', data.id);
    node.setAttribute('contenteditable', 'false');

    node.innerHTML = `
      <div class="flex border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <img
          src="${data.imageUrl}"
          alt="${data.title}"
          class="w-32 h-32 object-cover"
        />
        <div class="flex-1 p-4">
          <h4 class="font-semibold text-gray-900 dark:text-white">${data.title}</h4>
          ${data.description ? `<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${data.description}</p>` : ''}
          <div class="flex items-center justify-between mt-3">
            <span class="text-lg font-bold text-blue-600">${data.currency}${data.price}</span>
            <a
              href="${data.productUrl}"
              target="_blank"
              class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              View Product
            </a>
          </div>
        </div>
      </div>
    `;

    return node;
  }

  static value(node: HTMLElement): ProductCardData {
    const img = node.querySelector('img');
    const title = node.querySelector('h4');
    const price = node.querySelector('.text-blue-600');
    const link = node.querySelector('a');
    const desc = node.querySelector('p');

    return {
      id: node.getAttribute('data-id') || '',
      title: title?.textContent || '',
      price: parseFloat(price?.textContent?.replace(/[^0-9.]/g, '') || '0'),
      currency: price?.textContent?.replace(/[0-9.]/g, '') || '$',
      imageUrl: img?.src || '',
      productUrl: link?.href || '',
      description: desc?.textContent || undefined,
    };
  }
}

export default ProductCardBlot;
```

**Delta Format:**
```typescript
const delta = new Delta().insert({
  'product-card': {
    id: 'prod-123',
    title: 'Wireless Headphones',
    price: 99.99,
    currency: '$',
    imageUrl: '/images/headphones.jpg',
    productUrl: '/products/headphones',
    description: 'Premium sound quality'
  }
});
```

---

### 2. Mention Blot

Inline @mention with user reference.

```typescript
// src/blots/MentionBlot.ts

import Quill from 'quill';

const Embed = Quill.import('blots/embed');

export interface MentionData {
  id: string;
  name: string;
  avatar?: string;
}

class MentionBlot extends Embed {
  static blotName = 'mention';
  static tagName = 'span';
  static className = 'ql-mention';

  static create(data: MentionData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-id', data.id);
    node.setAttribute('data-name', data.name);
    node.setAttribute('contenteditable', 'false');

    node.innerHTML = `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
        ${data.avatar ? `<img src="${data.avatar}" class="w-4 h-4 rounded-full" />` : ''}
        @${data.name}
      </span>
    `;

    return node;
  }

  static value(node: HTMLElement): MentionData {
    return {
      id: node.getAttribute('data-id') || '',
      name: node.getAttribute('data-name') || '',
      avatar: node.querySelector('img')?.src,
    };
  }
}

export default MentionBlot;
```

**Delta Format:**
```typescript
const delta = new Delta()
  .insert('Hey ')
  .insert({ mention: { id: 'user-1', name: 'john_doe', avatar: '/avatars/john.jpg' } })
  .insert(' check this out!');
```

---

### 3. Interactive Checklist Blot

Checklist items with toggleable state.

```typescript
// src/blots/ChecklistBlot.ts

import Quill from 'quill';

const Block = Quill.import('blots/block');

export interface ChecklistItemData {
  checked: boolean;
}

class ChecklistBlot extends Block {
  static blotName = 'checklist';
  static tagName = 'div';
  static className = 'ql-checklist';

  static create(data: ChecklistItemData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-checked', String(data.checked));

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = data.checked;
    checkbox.className = 'mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500';

    checkbox.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      node.setAttribute('data-checked', String(target.checked));
      node.classList.toggle('line-through', target.checked);
      node.classList.toggle('text-gray-400', target.checked);
    });

    node.insertBefore(checkbox, node.firstChild);
    node.classList.add('flex', 'items-start', 'py-1');

    if (data.checked) {
      node.classList.add('line-through', 'text-gray-400');
    }

    return node;
  }

  static formats(node: HTMLElement): ChecklistItemData {
    return {
      checked: node.getAttribute('data-checked') === 'true',
    };
  }
}

export default ChecklistBlot;
```

**Delta Format:**
```typescript
const delta = new Delta()
  .insert('Buy groceries', { checklist: { checked: false } })
  .insert('\n')
  .insert('Call mom', { checklist: { checked: true } })
  .insert('\n');
```

---

### 4. Alert/Callout Blot

Styled message blocks for different alert types.

```typescript
// src/blots/AlertBlot.ts

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface AlertData {
  type: AlertType;
  title?: string;
  message: string;
}

const ALERT_STYLES: Record<AlertType, { bg: string; border: string; icon: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-500',
    icon: 'ℹ️',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-500',
    icon: '⚠️',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-500',
    icon: '❌',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-500',
    icon: '✅',
  },
};

class AlertBlot extends BlockEmbed {
  static blotName = 'alert';
  static tagName = 'div';
  static className = 'ql-alert';

  static create(data: AlertData): HTMLElement {
    const node = super.create() as HTMLElement;
    const styles = ALERT_STYLES[data.type];

    node.setAttribute('data-type', data.type);
    node.setAttribute('contenteditable', 'false');

    node.className = `ql-alert ${styles.bg} ${styles.border} border-l-4 p-4 my-2 rounded-r-lg`;

    node.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-xl">${styles.icon}</span>
        <div>
          ${data.title ? `<h5 class="font-semibold mb-1">${data.title}</h5>` : ''}
          <p class="text-sm">${data.message}</p>
        </div>
      </div>
    `;

    return node;
  }

  static value(node: HTMLElement): AlertData {
    const type = node.getAttribute('data-type') as AlertType || 'info';
    const title = node.querySelector('h5')?.textContent || undefined;
    const message = node.querySelector('p')?.textContent || '';

    return { type, title, message };
  }
}

export default AlertBlot;
```

**Delta Format:**
```typescript
const delta = new Delta().insert({
  alert: {
    type: 'warning',
    title: 'Important Notice',
    message: 'Please save your work before proceeding.'
  }
});
```

---

### 5. Enhanced Code Block Blot

Code block with syntax highlighting and language selector.

```typescript
// src/blots/CodeBlockBlot.ts

import Quill from 'quill';
import hljs from 'highlight.js';

const Block = Quill.import('blots/block');

export interface CodeBlockData {
  language: string;
  code: string;
}

class CodeBlockBlot extends Block {
  static blotName = 'code-block-enhanced';
  static tagName = 'div';
  static className = 'ql-code-block-enhanced';

  static create(data: CodeBlockData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-language', data.language);
    node.setAttribute('contenteditable', 'false');

    const highlighted = hljs.highlight(data.code, {
      language: data.language,
      ignoreIllegals: true
    }).value;

    node.innerHTML = `
      <div class="relative rounded-lg overflow-hidden bg-gray-900 my-2">
        <div class="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-400 text-xs">
          <select class="bg-transparent border-none text-gray-400 text-xs focus:outline-none">
            <option value="javascript" ${data.language === 'javascript' ? 'selected' : ''}>JavaScript</option>
            <option value="typescript" ${data.language === 'typescript' ? 'selected' : ''}>TypeScript</option>
            <option value="python" ${data.language === 'python' ? 'selected' : ''}>Python</option>
            <option value="html" ${data.language === 'html' ? 'selected' : ''}>HTML</option>
            <option value="css" ${data.language === 'css' ? 'selected' : ''}>CSS</option>
          </select>
          <button class="copy-btn hover:text-white transition-colors">Copy</button>
        </div>
        <pre class="p-4 overflow-x-auto"><code class="hljs language-${data.language}">${highlighted}</code></pre>
      </div>
    `;

    // Add copy functionality
    const copyBtn = node.querySelector('.copy-btn');
    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(data.code);
      if (copyBtn) copyBtn.textContent = 'Copied!';
      setTimeout(() => { if (copyBtn) copyBtn.textContent = 'Copy'; }, 2000);
    });

    return node;
  }

  static value(node: HTMLElement): CodeBlockData {
    return {
      language: node.getAttribute('data-language') || 'javascript',
      code: node.querySelector('code')?.textContent || '',
    };
  }
}

export default CodeBlockBlot;
```

**Delta Format:**
```typescript
const delta = new Delta().insert({
  'code-block-enhanced': {
    language: 'typescript',
    code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`
  }
});
```

---

### 6. Embed Blot (Video/Social)

Support for YouTube, Twitter, and custom embeds.

```typescript
// src/blots/EmbedBlot.ts

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export type EmbedType = 'youtube' | 'twitter' | 'iframe';

export interface EmbedData {
  type: EmbedType;
  url: string;
  title?: string;
}

class EmbedBlot extends BlockEmbed {
  static blotName = 'custom-embed';
  static tagName = 'div';
  static className = 'ql-custom-embed';

  static create(data: EmbedData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-type', data.type);
    node.setAttribute('data-url', data.url);
    node.setAttribute('contenteditable', 'false');

    let embedHtml = '';

    switch (data.type) {
      case 'youtube':
        const videoId = EmbedBlot.extractYouTubeId(data.url);
        embedHtml = `
          <div class="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              src="https://www.youtube.com/embed/${videoId}"
              class="absolute top-0 left-0 w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        `;
        break;
      case 'twitter':
        embedHtml = `
          <div class="twitter-embed p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <a href="${data.url}" target="_blank" class="text-blue-500 hover:underline">
              View Tweet
            </a>
          </div>
        `;
        break;
      default:
        embedHtml = `
          <iframe
            src="${data.url}"
            class="w-full h-64 rounded-lg border"
            frameborder="0"
          ></iframe>
        `;
    }

    node.innerHTML = `<div class="my-2">${embedHtml}</div>`;
    return node;
  }

  static extractYouTubeId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match?.[1] || '';
  }

  static value(node: HTMLElement): EmbedData {
    return {
      type: node.getAttribute('data-type') as EmbedType || 'iframe',
      url: node.getAttribute('data-url') || '',
    };
  }
}

export default EmbedBlot;
```

**Delta Format:**
```typescript
const delta = new Delta().insert({
  'custom-embed': {
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'My Video'
  }
});
```

---

### 7. Collapsible/Accordion Blot

Expandable content sections.

```typescript
// src/blots/CollapsibleBlot.ts

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export interface CollapsibleData {
  title: string;
  content: string;
  expanded: boolean;
}

class CollapsibleBlot extends BlockEmbed {
  static blotName = 'collapsible';
  static tagName = 'div';
  static className = 'ql-collapsible';

  static create(data: CollapsibleData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-expanded', String(data.expanded));

    node.innerHTML = `
      <div class="border rounded-lg overflow-hidden my-2">
        <button
          class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          type="button"
        >
          <span class="font-medium">${data.title}</span>
          <span class="chevron transform transition-transform ${data.expanded ? 'rotate-180' : ''}">▼</span>
        </button>
        <div class="content ${data.expanded ? '' : 'hidden'} p-4 border-t">
          ${data.content}
        </div>
      </div>
    `;

    const button = node.querySelector('button');
    const content = node.querySelector('.content');
    const chevron = node.querySelector('.chevron');

    button?.addEventListener('click', () => {
      const isExpanded = node.getAttribute('data-expanded') === 'true';
      node.setAttribute('data-expanded', String(!isExpanded));
      content?.classList.toggle('hidden');
      chevron?.classList.toggle('rotate-180');
    });

    return node;
  }

  static value(node: HTMLElement): CollapsibleData {
    return {
      title: node.querySelector('button span')?.textContent || '',
      content: node.querySelector('.content')?.innerHTML || '',
      expanded: node.getAttribute('data-expanded') === 'true',
    };
  }
}

export default CollapsibleBlot;
```

**Delta Format:**
```typescript
const delta = new Delta().insert({
  collapsible: {
    title: 'Click to expand',
    content: '<p>Hidden content here...</p>',
    expanded: false
  }
});
```

---

### 8. Divider Blot

Styled horizontal dividers.

```typescript
// src/blots/DividerBlot.ts

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export type DividerStyle = 'solid' | 'dashed' | 'dotted' | 'gradient' | 'stars';

export interface DividerData {
  style: DividerStyle;
}

class DividerBlot extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'div';
  static className = 'ql-divider';

  static create(data: DividerData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-style', data.style);
    node.setAttribute('contenteditable', 'false');

    let dividerHtml = '';

    switch (data.style) {
      case 'solid':
        dividerHtml = '<hr class="border-gray-300 dark:border-gray-600" />';
        break;
      case 'dashed':
        dividerHtml = '<hr class="border-dashed border-gray-300 dark:border-gray-600" />';
        break;
      case 'dotted':
        dividerHtml = '<hr class="border-dotted border-gray-300 dark:border-gray-600" />';
        break;
      case 'gradient':
        dividerHtml = '<div class="h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"></div>';
        break;
      case 'stars':
        dividerHtml = '<div class="text-center text-gray-400 tracking-[1em]">***</div>';
        break;
    }

    node.innerHTML = `<div class="my-6">${dividerHtml}</div>`;
    return node;
  }

  static value(node: HTMLElement): DividerData {
    return {
      style: node.getAttribute('data-style') as DividerStyle || 'solid',
    };
  }
}

export default DividerBlot;
```

**Delta Format:**
```typescript
const delta = new Delta().insert({
  divider: { style: 'gradient' }
});
```

---

### 9. Table (Enhanced) Blot

> **Note:** Full table implementation is complex. This shows the structure; actual implementation would require additional modules for cell selection, resizing, etc.

```typescript
// src/blots/TableBlot.ts (Simplified)

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export interface TableData {
  rows: string[][];
  headers: boolean;
}

class TableBlot extends BlockEmbed {
  static blotName = 'enhanced-table';
  static tagName = 'div';
  static className = 'ql-enhanced-table';

  static create(data: TableData): HTMLElement {
    const node = super.create() as HTMLElement;

    const headerRow = data.headers && data.rows.length > 0
      ? `<thead><tr>${data.rows[0].map(cell => `<th class="border px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold">${cell}</th>`).join('')}</tr></thead>`
      : '';

    const bodyRows = (data.headers ? data.rows.slice(1) : data.rows)
      .map(row => `<tr>${row.map(cell => `<td class="border px-4 py-2">${cell}</td>`).join('')}</tr>`)
      .join('');

    node.innerHTML = `
      <div class="overflow-x-auto my-4">
        <table class="w-full border-collapse border border-gray-300 dark:border-gray-600">
          ${headerRow}
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    `;

    return node;
  }

  static value(node: HTMLElement): TableData {
    const rows: string[][] = [];
    const tableRows = node.querySelectorAll('tr');
    tableRows.forEach(row => {
      const cells = row.querySelectorAll('th, td');
      rows.push(Array.from(cells).map(cell => cell.textContent || ''));
    });
    return {
      rows,
      headers: node.querySelector('th') !== null,
    };
  }
}

export default TableBlot;
```

**Delta Format:**
```typescript
const delta = new Delta().insert({
  'enhanced-table': {
    headers: true,
    rows: [
      ['Name', 'Price', 'Stock'],
      ['Widget A', '$10', '50'],
      ['Widget B', '$20', '30'],
    ]
  }
});
```

---

### 10. AI Assistant Blot (Ask Copilot)

Inline AI-powered text editing with selection-based transformations.

```typescript
// src/blots/AIAssistantBlot.ts

import Quill from 'quill';

const Embed = Quill.import('blots/embed');

export interface AIAssistantData {
  id: string;
  status: 'idle' | 'loading' | 'complete';
  originalText: string;
  suggestion?: string;
}

class AIAssistantBlot extends Embed {
  static blotName = 'ai-assistant';
  static tagName = 'span';
  static className = 'ql-ai-assistant';

  static create(data: AIAssistantData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-id', data.id);
    node.setAttribute('data-status', data.status);
    node.setAttribute('contenteditable', 'false');

    if (data.status === 'loading') {
      node.innerHTML = `
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg">
          <span class="animate-spin">⚙️</span>
          <span>AI is thinking...</span>
        </span>
      `;
    } else if (data.status === 'complete' && data.suggestion) {
      node.innerHTML = `
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg border-2 border-dashed border-green-300">
          <span>${data.suggestion}</span>
          <button class="accept-btn ml-2 text-green-600 hover:text-green-800" title="Accept">✓</button>
          <button class="reject-btn text-red-600 hover:text-red-800" title="Reject">✗</button>
        </span>
      `;
    }

    return node;
  }

  static value(node: HTMLElement): AIAssistantData {
    return {
      id: node.getAttribute('data-id') || '',
      status: node.getAttribute('data-status') as AIAssistantData['status'] || 'idle',
      originalText: '',
    };
  }
}

export default AIAssistantBlot;
```

---

## AI Assistant Module (Ask Copilot)

### Module Implementation

```typescript
// src/modules/AIAssistantModule.ts

import Quill from 'quill';
import { generateText, AIPromptType } from '../utils/aiService';

export interface AIAssistantOptions {
  apiEndpoint?: string;
  useMock?: boolean;
}

class AIAssistantModule {
  quill: Quill;
  options: AIAssistantOptions;
  toolbar: HTMLElement | null = null;

  constructor(quill: Quill, options: AIAssistantOptions) {
    this.quill = quill;
    this.options = options;

    this.quill.on('selection-change', this.handleSelectionChange.bind(this));
    this.createToolbar();
  }

  createToolbar() {
    this.toolbar = document.createElement('div');
    this.toolbar.className = `
      ai-toolbar hidden absolute z-50 bg-white dark:bg-gray-800
      rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2
    `;

    this.toolbar.innerHTML = `
      <div class="flex gap-1">
        <button data-action="improve" class="ai-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          ✨ Improve
        </button>
        <button data-action="simplify" class="ai-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          📝 Simplify
        </button>
        <button data-action="expand" class="ai-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          📖 Expand
        </button>
        <button data-action="fix-grammar" class="ai-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          🔤 Fix Grammar
        </button>
        <button data-action="custom" class="ai-btn px-3 py-1.5 text-sm rounded bg-purple-600 text-white hover:bg-purple-700">
          🤖 Ask Copilot
        </button>
      </div>
    `;

    this.toolbar.querySelectorAll('.ai-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = (e.target as HTMLElement).getAttribute('data-action');
        if (action) this.handleAction(action as AIPromptType);
      });
    });

    document.body.appendChild(this.toolbar);
  }

  handleSelectionChange(range: { index: number; length: number } | null) {
    if (!this.toolbar) return;

    if (range && range.length > 0) {
      const bounds = this.quill.getBounds(range.index, range.length);
      const editorRect = this.quill.container.getBoundingClientRect();

      this.toolbar.style.left = `${editorRect.left + bounds.left}px`;
      this.toolbar.style.top = `${editorRect.top + bounds.top - 50}px`;
      this.toolbar.classList.remove('hidden');
    } else {
      this.toolbar.classList.add('hidden');
    }
  }

  async handleAction(action: AIPromptType) {
    const range = this.quill.getSelection();
    if (!range || range.length === 0) return;

    const selectedText = this.quill.getText(range.index, range.length);

    if (action === 'custom') {
      const prompt = window.prompt('What would you like to do with this text?');
      if (!prompt) return;
      // Handle custom prompt
    }

    try {
      // Show loading state
      this.toolbar?.classList.add('hidden');

      const result = await generateText({
        text: selectedText,
        action,
        useMock: this.options.useMock,
      });

      // Replace selected text with result
      this.quill.deleteText(range.index, range.length);
      this.quill.insertText(range.index, result);

    } catch (error) {
      console.error('AI Assistant error:', error);
    }
  }
}

export default AIAssistantModule;
```

### AI Service (Mock/Real)

```typescript
// src/utils/aiService.ts

export type AIPromptType = 'improve' | 'simplify' | 'expand' | 'fix-grammar' | 'custom';

interface GenerateTextOptions {
  text: string;
  action: AIPromptType;
  customPrompt?: string;
  useMock?: boolean;
}

// Mock responses for demo
const MOCK_RESPONSES: Record<AIPromptType, (text: string) => string> = {
  improve: (text) => `${text} [improved with better clarity and flow]`,
  simplify: (text) => text.split(' ').slice(0, Math.ceil(text.split(' ').length / 2)).join(' ') + '.',
  expand: (text) => `${text} Furthermore, this topic deserves additional exploration. Let me elaborate on the key points mentioned above.`,
  'fix-grammar': (text) => text.charAt(0).toUpperCase() + text.slice(1).replace(/\s+/g, ' ').trim() + '.',
  custom: (text) => `[Custom transformation of: "${text}"]`,
};

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const { text, action, useMock = true } = options;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (useMock) {
    return MOCK_RESPONSES[action](text);
  }

  // Real API call (when ready)
  // const response = await fetch('/api/ai/generate', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ text, action, prompt: options.customPrompt }),
  // });
  // return response.json();

  return MOCK_RESPONSES[action](text);
}
```

### Registering the AI Module

```typescript
// src/modules/index.ts

import Quill from 'quill';
import AIAssistantModule from './AIAssistantModule';
import MentionModule from './MentionModule';

export function registerModules() {
  Quill.register('modules/aiAssistant', AIAssistantModule);
  Quill.register('modules/mention', MentionModule);
}
```

### Using AI Module in Editor

```typescript
// In Editor initialization
const quill = new Quill(container, {
  theme: 'snow',
  modules: {
    toolbar: [...],
    aiAssistant: {
      useMock: true, // Set to false for real API
      apiEndpoint: '/api/ai/generate',
    },
  },
});
```

---

## Working with Delta

### Delta Structure

Delta is Quill's format for representing content:

```typescript
import { Delta } from 'quill/core';

// Creating content
const content = new Delta()
  .insert('Hello ', { bold: true })
  .insert('World')
  .insert('\n', { header: 1 });
```

### Common Operations

```typescript
// Get content
const delta = quill.getContents();

// Set content
quill.setContents(delta);

// Get plain text
const text = quill.getText();

// Apply changes
const change = new Delta().retain(5).delete(3).insert('new text');
quill.updateContents(change);
```

## Event Handling

### Text Change Event

```typescript
quill.on('text-change', (delta, oldDelta, source) => {
  // delta: The change that occurred
  // oldDelta: Previous document state
  // source: 'user' | 'api' | 'silent'

  if (source === 'user') {
    console.log('User made a change:', delta);
  }
});
```

### Selection Change Event

```typescript
quill.on('selection-change', (range, oldRange, source) => {
  if (range === null) {
    console.log('Editor lost focus');
  } else if (range.length === 0) {
    console.log('Cursor at index:', range.index);
  } else {
    console.log('Selection:', range.index, 'to', range.index + range.length);
  }
});
```

## App Integration Example

```tsx
// src/App.tsx

import { useRef, useState, useCallback } from 'react';
import Quill from 'quill';
import { Delta } from 'quill/core';
import Editor from './components/Editor';

function App() {
  const quillRef = useRef<Quill | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  const initialContent = new Delta()
    .insert('Welcome to the Editor')
    .insert('\n', { header: 1 })
    .insert('Start typing here...')
    .insert('\n');

  const handleTextChange = useCallback((delta: Delta) => {
    console.log('Content changed:', delta);
  }, []);

  const handleGetContent = () => {
    if (quillRef.current) {
      const content = quillRef.current.getContents();
      console.log('Current content:', JSON.stringify(content));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            React Quill Editor
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setReadOnly(!readOnly)}
              className="px-4 py-2 text-sm font-medium rounded-md
                bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-200 transition-colors"
            >
              {readOnly ? 'Enable Editing' : 'Disable Editing'}
            </button>
            <button
              onClick={handleGetContent}
              className="px-4 py-2 text-sm font-medium rounded-md
                bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Get Content
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Editor
          ref={quillRef}
          defaultValue={initialContent}
          readOnly={readOnly}
          placeholder="Write something amazing..."
          theme="snow"
          onTextChange={handleTextChange}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        />
      </main>
    </div>
  );
}

export default App;
```

## Styling with Tailwind CSS

### Tailwind CSS Setup

#### Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Tailwind Configuration

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' for automatic
  theme: {
    extend: {
      // Custom colors for editor if needed
      colors: {
        editor: {
          toolbar: '#f8f9fa',
          border: '#dee2e6',
        }
      }
    },
  },
  plugins: [],
}
```

#### Main CSS File

```css
/* src/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Quill theme imports */
@import 'quill/dist/quill.snow.css';
@import 'quill/dist/quill.bubble.css';

/* Quill editor customizations using Tailwind's @apply */
@layer components {
  /* Editor container flex behavior */
  .ql-container {
    @apply flex-1 overflow-auto text-base;
  }

  .ql-editor {
    @apply min-h-full;
  }

  /* Placeholder styling */
  .ql-editor.ql-blank::before {
    @apply text-gray-400 italic;
  }

  /* Snow theme toolbar customization */
  .ql-snow .ql-toolbar {
    @apply bg-gray-50 border-gray-200 rounded-t-lg;
  }

  .ql-snow .ql-container {
    @apply border-gray-200 rounded-b-lg;
  }

  /* Dark mode support */
  .dark .ql-snow .ql-toolbar {
    @apply bg-gray-700 border-gray-600;
  }

  .dark .ql-snow .ql-container {
    @apply bg-gray-800 border-gray-600 text-white;
  }

  .dark .ql-snow .ql-stroke {
    stroke: #fff;
  }

  .dark .ql-snow .ql-fill {
    fill: #fff;
  }

  .dark .ql-snow .ql-picker-label {
    @apply text-white;
  }

  .dark .ql-snow .ql-picker-options {
    @apply bg-gray-700;
  }

  .dark .ql-editor.ql-blank::before {
    @apply text-gray-500;
  }
}
```

### Using Tailwind Classes in Components

The Editor component uses Tailwind classes directly:

```tsx
// Editor container with Tailwind
<div
  ref={containerRef}
  className={`flex flex-col h-96 ${className}`}
/>

// Usage with custom classes
<Editor
  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
/>
```

### Common Tailwind Patterns for Editor

```tsx
// Full-height editor
<Editor className="h-full min-h-[500px]" />

// Fixed height with scroll
<Editor className="h-96 overflow-hidden" />

// Responsive height
<Editor className="h-64 md:h-96 lg:h-[600px]" />

// With custom border radius
<Editor className="rounded-xl overflow-hidden" />

// With focus ring
<Editor className="focus-within:ring-2 focus-within:ring-blue-500" />
```

### Custom Toolbar with Tailwind (HTML-based)

```tsx
<div id="toolbar" className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
  <div className="flex gap-1">
    <button className="ql-bold p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" />
    <button className="ql-italic p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" />
    <button className="ql-underline p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" />
  </div>
  <div className="w-px bg-gray-300 dark:bg-gray-500 mx-1" /> {/* Divider */}
  <div className="flex gap-1">
    <button className="ql-list p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" value="ordered" />
    <button className="ql-list p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" value="bullet" />
  </div>
</div>
```

## Optional Enhancements

### 1. Syntax Highlighting (Code Blocks)

```typescript
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// Register with Quill
Quill.register('modules/syntax', true);

// Configure
const quill = new Quill(container, {
  modules: {
    syntax: {
      highlight: (text: string) => hljs.highlightAuto(text).value,
    },
    toolbar: [...],
  },
});
```

### 2. Image Upload Handler

```typescript
const quill = new Quill(container, {
  modules: {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
              const url = await uploadImage(file); // Your upload function
              const range = this.quill.getSelection();
              this.quill.insertEmbed(range.index, 'image', url);
            }
          };
        },
      },
    },
  },
});
```

### 3. Auto-save Hook

```typescript
// src/hooks/useAutoSave.ts

import { useEffect, useRef } from 'react';
import type Quill from 'quill';

export function useAutoSave(
  quillRef: React.RefObject<Quill | null>,
  saveInterval: number = 30000,
  onSave: (content: string) => Promise<void>
) {
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    const interval = setInterval(async () => {
      const quill = quillRef.current;
      if (!quill) return;

      const content = JSON.stringify(quill.getContents());
      if (content !== lastSavedRef.current) {
        await onSave(content);
        lastSavedRef.current = content;
      }
    }, saveInterval);

    return () => clearInterval(interval);
  }, [quillRef, saveInterval, onSave]);
}
```

## TypeScript Support

### Type Definitions

Quill v2 includes TypeScript definitions. Key types:

```typescript
import Quill from 'quill';
import { Delta } from 'quill/core';

// Quill instance type
type QuillInstance = InstanceType<typeof Quill>;

// Event types
type TextChangeHandler = (delta: Delta, oldDelta: Delta, source: string) => void;
type SelectionChangeHandler = (range: Range | null, oldRange: Range | null, source: string) => void;

// Range type
interface Range {
  index: number;
  length: number;
}
```

## Dependencies

### Required

```json
{
  "dependencies": {
    "quill": "^2.0.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "highlight.js": "^11.9.0"
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "sass": "^1.77.0",
    "eslint": "^9.39.1",
    "@eslint/js": "^9.39.1",
    "typescript-eslint": "^8.33.1",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "prettier": "^3.3.0",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-prettier": "^5.5.1",
    "globals": "^16.2.0"
  }
}
```

### Optional (for enhanced features)

```json
{
  "dependencies": {
    "katex": "^0.16.9"
  }
}
```

## Implementation Checklist

### Phase 0: Development Environment Setup
- [ ] **ESLint Setup**
  - [ ] Install ESLint and plugins
  - [ ] Create `eslint.config.js` with TypeScript & React rules
  - [ ] Add `lint` and `lint:fix` scripts to package.json
- [ ] **Prettier Setup**
  - [ ] Install Prettier
  - [ ] Create `.prettierrc` configuration
  - [ ] Create `.prettierignore`
  - [ ] Add `format` and `format:check` scripts
- [ ] **SCSS Setup**
  - [ ] Install `sass` package
  - [ ] Create `src/styles/` directory structure
  - [ ] Create `_variables.scss` with theme colors
  - [ ] Create `_mixins.scss` with reusable mixins
  - [ ] Create `index.scss` entry point
  - [ ] Configure Vite for SCSS with path aliases
- [ ] **GitHub Actions CI/CD**
  - [ ] Create `.github/workflows/ci.yml`
  - [ ] Configure validate job (type-check, lint, format, build)
  - [ ] Configure test job
  - [ ] Configure deploy preview job (PR)
  - [ ] Configure deploy production job (main branch)
- [ ] **Dark Theme Infrastructure**
  - [ ] Create `ThemeProvider` context
  - [ ] Create `useTheme` hook
  - [ ] Create `ThemeToggle` component
  - [ ] Add `data-theme` attribute support
  - [ ] Create `_dark-theme.scss` with Quill overrides

### Phase 1: Core Editor Setup
- [ ] Install dependencies (`npm install quill highlight.js`)
- [ ] Install Tailwind CSS (`npm install -D tailwindcss postcss autoprefixer`)
- [ ] Initialize Tailwind (`npx tailwindcss init -p`)
- [ ] Configure `tailwind.config.js` with content paths and dark mode
- [ ] Add Tailwind directives to `index.css`
- [ ] Import Quill CSS themes
- [ ] Create Editor component with forwardRef pattern
- [ ] Implement useLayoutEffect for callback synchronization
- [ ] Set up Quill initialization in useEffect
- [ ] Add proper cleanup on unmount
- [ ] Add TypeScript interfaces
- [ ] Add `className` prop for custom styling

### Phase 2: Custom Blots (Core)
- [ ] Create `src/blots/` directory structure
- [ ] Implement base blot registration (`src/blots/index.ts`)
- [ ] **Alert Blot** - Info, warning, error, success callouts
- [ ] **Divider Blot** - Styled horizontal rules (5 variants)
- [ ] **Checklist Blot** - Interactive checkboxes with state
- [ ] **Mention Blot** - @user inline references

### Phase 3: Custom Blots (Advanced)
- [ ] **Product Card Blot** - Embedded product with image, price, CTA
- [ ] **Code Block Blot** - Syntax highlighting with language selector
- [ ] **Embed Blot** - YouTube, Twitter, custom embeds
- [ ] **Collapsible Blot** - Expandable content sections
- [ ] **Table Blot** - Enhanced table with headers

### Phase 4: AI Assistant (Ask Copilot)
- [ ] Create `src/modules/AIAssistantModule.ts`
- [ ] Create `src/utils/aiService.ts` with mock responses
- [ ] Implement selection-based AI toolbar
- [ ] Add "Improve", "Simplify", "Expand", "Fix Grammar" actions
- [ ] Add "Ask Copilot" custom prompt action
- [ ] **AI Assistant Blot** - Loading/suggestion states
- [ ] Test AI module integration

### Phase 5: Styling & Polish
- [ ] Create `_quill-overrides.scss` for base theme customization
- [ ] Create `_blots.scss` for custom blot styles
- [ ] Implement dark mode support for all blots in `_dark-theme.scss`
- [ ] Style editor container with Tailwind + SCSS
- [ ] Add custom toolbar with blot insertion buttons
- [ ] Test all blots with Delta serialization/deserialization
- [ ] Support both themes (snow/bubble)
- [ ] Test dark/light theme toggle

### Phase 6: Demo & Documentation
- [ ] Create demo page showcasing all blots
- [ ] Add sample content demonstrating each blot type
- [ ] Test Delta export/import
- [ ] Document usage examples
- [ ] Set up Vercel/Netlify deployment
- [ ] Configure GitHub Actions for auto-deploy
- [ ] Verify CI checks pass on PRs

### Skills Demonstrated
- [ ] Deep DOM manipulation (custom blot rendering)
- [ ] Library extension (Quill Blot API)
- [ ] Data structures (Delta format)
- [ ] React integration patterns (forwardRef, useLayoutEffect)
- [ ] TypeScript interfaces for custom data structures
- [ ] Event handling and state synchronization
- [ ] AI integration patterns (mock/real API)

## References

### Quill
- [Quill Official Documentation](https://quilljs.com/docs)
- [Quill React Playground](https://quilljs.com/playground/react)
- [Quill GitHub Repository](https://github.com/slab/quill)
- [Delta Documentation](https://quilljs.com/docs/delta)
- [Parchment (Blot API)](https://github.com/slab/parchment)
- [Quill Modules Guide](https://quilljs.com/docs/modules)

### Styling
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/guides/vite)

### Code Highlighting
- [highlight.js](https://highlightjs.org/)
- [highlight.js Supported Languages](https://highlightjs.org/static/demo/)