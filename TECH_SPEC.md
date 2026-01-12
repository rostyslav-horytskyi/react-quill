# Technical Specification: Advanced Rich Text Engine (Quill Customization)

## Table of Contents

1. [Overview](#overview)
2. [Phase 0: Project Setup](#phase-0-project-setup)
3. [Phase 1: Core Editor](#phase-1-core-editor)
4. [Phase 2: Dark Theme](#phase-2-dark-theme)
5. [Phase 3: Simple Blots](#phase-3-simple-blots)
6. [Phase 4: Medium Complexity Blots](#phase-4-medium-complexity-blots)
7. [Phase 5: Complex Blots](#phase-5-complex-blots)
8. [Phase 6: AI Assistant](#phase-6-ai-assistant)
9. [Implementation Checklist](#implementation-checklist)
10. [References](#references)

---

## Overview

### Project Purpose

This is a **portfolio demonstration project** showcasing advanced Quill editor customization capabilities:

- **Deep DOM manipulation** - Custom rendering and DOM structure management
- **Library extension** - Extending Quill with custom Blots and modules
- **Data structures** - Working with Delta format for content representation
- **React integration** - Proper patterns for integrating imperative libraries with React

### What We're Building

A rich text editor with **10 custom Blots** organized by complexity:

| #   | Blot                  | Complexity | Phase |
| --- | --------------------- | ---------- | ----- |
| 1   | Divider               | Low        | 3     |
| 2   | Alert/Callout         | Low        | 3     |
| 3   | Mention               | Medium     | 4     |
| 4   | Interactive Checklist | Medium     | 4     |
| 5   | Collapsible/Accordion | Medium     | 4     |
| 6   | Code Block (Enhanced) | Medium     | 4     |
| 7   | Embed (Video/Social)  | Medium     | 4     |
| 8   | Product Card          | High       | 5     |
| 9   | Table (Enhanced)      | High       | 5     |
| 10  | AI Assistant          | High       | 6     |

### Tech Stack

| Technology     | Version | Purpose          |
| -------------- | ------- | ---------------- |
| React          | 19.x    | UI framework     |
| Vite           | 7.x     | Build tool       |
| TypeScript     | 5.x     | Type safety      |
| Quill          | 2.x     | Rich text engine |
| SCSS           | 1.x     | Component styles |
| ESLint         | 9.x     | Code linting     |
| Stylelint      | 16.x    | Style linting    |
| Prettier       | 3.x     | Code formatting  |
| Husky          | 9.x     | Git hooks        |
| GitHub Actions | -       | CI/CD pipeline   |

### Project Structure

```
react-quill/
├── src/
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── index.ts
│   │   │   ├── Editor.tsx
│   │   │   ├── Editor.scss
│   │   │   └── types.ts
│   │   ├── ThemeProvider/
│   │   │   ├── index.ts
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── useTheme.ts
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── Dropdown.tsx
│   ├── blots/
│   │   ├── index.ts
│   │   ├── DividerBlot.ts
│   │   ├── AlertBlot.ts
│   │   ├── MentionBlot.ts
│   │   ├── ChecklistBlot.ts
│   │   ├── CollapsibleBlot.ts
│   │   ├── CodeBlockBlot.ts
│   │   ├── EmbedBlot.ts
│   │   ├── ProductCardBlot.ts
│   │   ├── TableBlot.ts
│   │   └── AIAssistantBlot.ts
│   ├── modules/
│   │   ├── index.ts
│   │   ├── AIAssistantModule.ts
│   │   └── MentionModule.ts
│   ├── styles/
│   │   ├── index.scss
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _quill-overrides.scss
│   │   ├── _blots.scss
│   │   └── _dark-theme.scss
│   ├── hooks/
│   │   ├── useQuill.ts
│   │   └── useAutoSave.ts
│   ├── utils/
│   │   ├── delta.ts
│   │   └── aiService.ts
│   ├── types/
│   │   ├── blots.ts
│   │   └── editor.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   └── pre-commit
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── .stylelintrc.json
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 0: Project Setup

This phase establishes all development tooling before writing any application code.

### 0.1 Initialize Project

```bash
# Create Vite project with React + TypeScript
npm create vite@latest react-quill -- --template react-swc-ts
cd react-quill
npm install
```

### 0.2 Install Dependencies

```bash
# Core dependencies
npm install quill

# Dev dependencies - Linting & Formatting
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D stylelint stylelint-config-standard-scss stylelint-config-prettier-scss stylelint-order stylelint-prettier

# Dev dependencies - Git hooks
npm install -D husky lint-staged

# Dev dependencies - Styling
npm install -D sass
```

### 0.3 ESLint Configuration

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

### 0.4 Prettier Configuration

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
  "jsxSingleQuote": false
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

### 0.5 Stylelint Configuration

```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard-scss", "stylelint-config-prettier-scss"],
  "plugins": ["stylelint-order", "stylelint-prettier"],
  "rules": {
    "order/properties-alphabetical-order": true,
    "prettier/prettier": true,
    "scss/at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["tailwind", "apply", "layer", "config"]
      }
    ],
    "selector-class-pattern": null
  }
}
```

### 0.6 Husky & lint-staged Setup

```bash
# Initialize Husky
npx husky init
```

```bash
# .husky/pre-commit
npx lint-staged
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{scss,css}": ["stylelint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### 0.7 Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:styles": "stylelint \"src/**/*.{css,scss}\"",
    "lint:styles:fix": "stylelint \"src/**/*.{css,scss}\" --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,scss,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,scss,css,json}\"",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint && npm run lint:styles && npm run format:check",
    "prepare": "husky"
  }
}
```

### 0.8 SCSS Setup

#### Variables

```scss
// src/styles/_variables.scss

// Colors
$color-primary: #3b82f6;
$color-primary-hover: #2563eb;
$color-secondary: #6b7280;
$color-success: #10b981;
$color-warning: #f59e0b;
$color-error: #ef4444;
$color-info: #3b82f6;

// Light theme
$light-bg: #fff;
$light-bg-secondary: #f9fafb;
$light-text: #111827;
$light-text-secondary: #6b7280;
$light-border: #e5e7eb;

// Dark theme
$dark-bg: #1f2937;
$dark-bg-secondary: #111827;
$dark-text: #f9fafb;
$dark-text-secondary: #9ca3af;
$dark-border: #374151;

// CSS Custom Properties
:root {
  --color-primary: #{$color-primary};
  --color-primary-hover: #{$color-primary-hover};
  --color-success: #{$color-success};
  --color-warning: #{$color-warning};
  --color-error: #{$color-error};
  --color-info: #{$color-info};

  --bg-primary: #{$light-bg};
  --bg-secondary: #{$light-bg-secondary};
  --text-primary: #{$light-text};
  --text-secondary: #{$light-text-secondary};
  --border-color: #{$light-border};
}

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

// Transitions
$transition-fast: 150ms ease;
$transition-normal: 200ms ease;

// Z-index
$z-dropdown: 100;
$z-modal: 200;
$z-tooltip: 300;
```

#### Mixins

```scss
// src/styles/_mixins.scss

@use 'variables' as *;

@mixin flex-center {
  align-items: center;
  display: flex;
  justify-content: center;
}

@mixin flex-between {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

@mixin button-base {
  align-items: center;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 500;
  justify-content: center;
  padding: $spacing-sm $spacing-md;
  transition: all $transition-fast;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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

@mixin card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $radius-lg;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}
```

#### Main Entry Point

```scss
// src/styles/index.scss

@use 'variables';
@use 'mixins';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  transition:
    background-color variables.$transition-normal,
    color variables.$transition-normal;
}
```

### 0.9 Vite Configuration

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

### 0.10 GitHub Actions CI

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

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

      - name: Lint (ESLint)
        run: npm run lint

      - name: Lint styles (Stylelint)
        run: npm run lint:styles

      - name: Format check (Prettier)
        run: npm run format:check

      - name: Build
        run: npm run build
```

---

## Phase 1: Core Editor

This phase implements the basic Quill editor integration with React.

### 1.1 Architecture: Uncontrolled Component with ForwardRef

The implementation follows an **uncontrolled component pattern**:

- Direct access to Quill instance via ref
- No React state synchronization issues
- Optimal performance (no re-renders on keystroke)
- Aligns with Quill's imperative API

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

### 1.2 TypeScript Interfaces

```typescript
// src/components/Editor/types.ts

import type Quill from 'quill';
import type { Delta } from 'quill/core';

export interface EditorProps {
  /** Initial content as Delta */
  defaultValue?: Delta;
  /** Read-only mode */
  readOnly?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Theme: 'snow' | 'bubble' */
  theme?: 'snow' | 'bubble';
  /** Additional CSS classes */
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

### 1.3 Editor Component

```typescript
// src/components/Editor/Editor.tsx

import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import type { EditorProps } from './types';
import './Editor.scss';

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

    // Initialize Quill
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Create editor container
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
        className={`editor-container ${className}`}
      />
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;
```

### 1.4 Editor Styles

```scss
// src/components/Editor/Editor.scss

@use '@/styles/variables' as *;

.editor-container {
  display: flex;
  flex-direction: column;
  height: 400px;

  .ql-toolbar {
    background-color: var(--bg-secondary);
    border-color: var(--border-color);
    border-radius: $radius-lg $radius-lg 0 0;
  }

  .ql-container {
    background-color: var(--bg-primary);
    border-color: var(--border-color);
    border-radius: 0 0 $radius-lg $radius-lg;
    flex: 1;
    font-size: 1rem;
    overflow: auto;
  }

  .ql-editor {
    min-height: 100%;

    &.ql-blank::before {
      color: var(--text-secondary);
      font-style: italic;
    }
  }
}
```

### 1.5 Key Implementation Details

**1. Ref Pattern for Callbacks**

```typescript
const onTextChangeRef = useRef(onTextChange);

useLayoutEffect(() => {
  onTextChangeRef.current = onTextChange;
});
```

**Why**: React's `useEffect` captures variables at creation time. Without refs, event handlers would reference stale callback versions.

**2. Dynamic Container Creation**

```typescript
const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));
```

**Why**: Quill modifies DOM directly. Creating the container in the effect ensures proper cleanup and prevents React reconciliation conflicts.

**3. Cleanup on Unmount**

```typescript
return () => {
  ref.current = null;
  container.innerHTML = '';
};
```

**Why**: Prevents memory leaks and ensures clean state if component remounts.

### 1.6 Working with Delta

Delta is Quill's format for representing content:

```typescript
import { Delta } from 'quill/core';

// Creating content
const content = new Delta()
  .insert('Hello ', { bold: true })
  .insert('World')
  .insert('\n', { header: 1 });

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

---

## Phase 2: Dark Theme

This phase implements dark/light theme switching.

### 2.1 Theme Context

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

### 2.2 Theme Toggle Component

```typescript
// src/components/ui/ThemeToggle.tsx

import { useTheme } from '../ThemeProvider';
import './ThemeToggle.scss';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {resolvedTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

### 2.3 Dark Theme Styles

```scss
// src/styles/_dark-theme.scss

@use 'variables' as *;

[data-theme='dark'] {
  // Snow theme toolbar
  .ql-snow .ql-toolbar {
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

    .ql-picker {
      color: $dark-text-secondary;

      &-options {
        background-color: $dark-bg;
        border-color: $dark-border;
      }

      &-item:hover {
        color: $dark-text;
        background-color: $dark-bg-secondary;
      }
    }
  }

  // Snow theme container
  .ql-snow .ql-container {
    background-color: $dark-bg;
    border-color: $dark-border;
    color: $dark-text;
  }

  .ql-snow .ql-editor {
    color: $dark-text;

    &.ql-blank::before {
      color: $dark-text-secondary;
    }

    pre.ql-syntax {
      background-color: lighten($dark-bg-secondary, 5%);
      border: 1px solid $dark-border;
    }

    blockquote {
      border-left-color: $dark-border;
      color: $dark-text-secondary;
    }

    a {
      color: lighten($color-primary, 10%);
    }
  }
}
```

### 2.4 Using Theme in App

```tsx
// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './components/ThemeProvider';
import App from './App';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## Phase 3: Simple Blots

This phase implements low-complexity blots to understand the Blot API.

### 3.0 Understanding Quill Blots

Blots are the building blocks of Quill's document model:

```
Quill Document Model
├── Block Blots (block-level)
│   ├── Paragraph, Header, List
│   └── Custom: Alert, Collapsible
├── Inline Blots (inline)
│   ├── Bold, Italic, Link
│   └── Custom: Mention
└── Embed Blots (void/atomic)
    ├── Image, Video
    └── Custom: Divider, Product Card
```

| Type       | Base Class             | Content                     |
| ---------- | ---------------------- | --------------------------- |
| **Block**  | `Block` / `BlockEmbed` | Contains other blots        |
| **Inline** | `Inline`               | Wraps text                  |
| **Embed**  | `Embed`                | Self-contained, no children |

### 3.1 Blot Registration

```typescript
// src/blots/index.ts

import Quill from 'quill';
import DividerBlot from './DividerBlot';
import AlertBlot from './AlertBlot';

export function registerBlots() {
  Quill.register(DividerBlot);
  Quill.register(AlertBlot);
}

export { DividerBlot, AlertBlot };
```

### 3.2 Divider Blot (Complexity: Low)

Styled horizontal dividers with variants.

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
        dividerHtml = '<hr class="divider-solid" />';
        break;
      case 'dashed':
        dividerHtml = '<hr class="divider-dashed" />';
        break;
      case 'dotted':
        dividerHtml = '<hr class="divider-dotted" />';
        break;
      case 'gradient':
        dividerHtml = '<div class="divider-gradient"></div>';
        break;
      case 'stars':
        dividerHtml = '<div class="divider-stars">***</div>';
        break;
    }

    node.innerHTML = `<div class="divider-wrapper">${dividerHtml}</div>`;
    return node;
  }

  static value(node: HTMLElement): DividerData {
    return {
      style: (node.getAttribute('data-style') as DividerStyle) || 'solid',
    };
  }
}

export default DividerBlot;
```

**Delta Format:**

```typescript
new Delta().insert({ divider: { style: 'gradient' } });
```

### 3.3 Alert/Callout Blot (Complexity: Low)

Info, warning, error, success message blocks.

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

const ALERT_CONFIG: Record<AlertType, { icon: string; class: string }> = {
  info: { icon: 'ℹ️', class: 'alert-info' },
  warning: { icon: '⚠️', class: 'alert-warning' },
  error: { icon: '❌', class: 'alert-error' },
  success: { icon: '✅', class: 'alert-success' },
};

class AlertBlot extends BlockEmbed {
  static blotName = 'alert';
  static tagName = 'div';
  static className = 'ql-alert';

  static create(data: AlertData): HTMLElement {
    const node = super.create() as HTMLElement;
    const config = ALERT_CONFIG[data.type];

    node.setAttribute('data-type', data.type);
    node.setAttribute('contenteditable', 'false');
    node.classList.add(config.class);

    node.innerHTML = `
      <div class="alert-content">
        <span class="alert-icon">${config.icon}</span>
        <div class="alert-body">
          ${data.title ? `<h5 class="alert-title">${data.title}</h5>` : ''}
          <p class="alert-message">${data.message}</p>
        </div>
      </div>
    `;

    return node;
  }

  static value(node: HTMLElement): AlertData {
    return {
      type: (node.getAttribute('data-type') as AlertType) || 'info',
      title: node.querySelector('.alert-title')?.textContent || undefined,
      message: node.querySelector('.alert-message')?.textContent || '',
    };
  }
}

export default AlertBlot;
```

**Delta Format:**

```typescript
new Delta().insert({
  alert: {
    type: 'warning',
    title: 'Important',
    message: 'Please save your work.',
  },
});
```

### 3.4 Blot Styles

```scss
// src/styles/_blots.scss

@use 'variables' as *;

// Divider styles
.ql-divider {
  margin: $spacing-lg 0;

  .divider-wrapper {
    padding: $spacing-sm 0;
  }

  .divider-solid {
    border: none;
    border-top: 1px solid var(--border-color);
  }

  .divider-dashed {
    border: none;
    border-top: 1px dashed var(--border-color);
  }

  .divider-dotted {
    border: none;
    border-top: 2px dotted var(--border-color);
  }

  .divider-gradient {
    background: linear-gradient(to right, transparent, var(--border-color), transparent);
    border-radius: 2px;
    height: 2px;
  }

  .divider-stars {
    color: var(--text-secondary);
    letter-spacing: 1em;
    text-align: center;
  }
}

// Alert styles
.ql-alert {
  border-left: 4px solid;
  border-radius: 0 $radius-md $radius-md 0;
  margin: $spacing-md 0;
  padding: $spacing-md;

  &.alert-info {
    background-color: rgba($color-info, 0.1);
    border-left-color: $color-info;
  }

  &.alert-warning {
    background-color: rgba($color-warning, 0.1);
    border-left-color: $color-warning;
  }

  &.alert-error {
    background-color: rgba($color-error, 0.1);
    border-left-color: $color-error;
  }

  &.alert-success {
    background-color: rgba($color-success, 0.1);
    border-left-color: $color-success;
  }

  .alert-content {
    align-items: flex-start;
    display: flex;
    gap: $spacing-sm;
  }

  .alert-icon {
    font-size: 1.25rem;
  }

  .alert-title {
    font-weight: 600;
    margin-bottom: $spacing-xs;
  }

  .alert-message {
    font-size: 0.875rem;
  }
}
```

---

## Phase 4: Medium Complexity Blots

This phase implements blots with more complex behavior.

### 4.1 Mention Blot

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
      <span class="mention-badge">
        ${data.avatar ? `<img src="${data.avatar}" class="mention-avatar" alt="" />` : ''}
        <span class="mention-name">@${data.name}</span>
      </span>
    `;

    return node;
  }

  static value(node: HTMLElement): MentionData {
    return {
      id: node.getAttribute('data-id') || '',
      name: node.getAttribute('data-name') || '',
      avatar: node.querySelector('.mention-avatar')?.getAttribute('src') || undefined,
    };
  }
}

export default MentionBlot;
```

**Delta Format:**

```typescript
new Delta()
  .insert('Hey ')
  .insert({ mention: { id: 'user-1', name: 'john_doe' } })
  .insert(' check this out!');
```

### 4.2 Interactive Checklist Blot

Toggleable checkboxes with persistent state.

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
    checkbox.className = 'checklist-checkbox';

    checkbox.addEventListener('change', e => {
      const target = e.target as HTMLInputElement;
      node.setAttribute('data-checked', String(target.checked));
      node.classList.toggle('is-checked', target.checked);
    });

    node.insertBefore(checkbox, node.firstChild);
    node.classList.add('checklist-item');

    if (data.checked) {
      node.classList.add('is-checked');
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
new Delta()
  .insert('Buy groceries', { checklist: { checked: false } })
  .insert('\n')
  .insert('Call mom', { checklist: { checked: true } })
  .insert('\n');
```

### 4.3 Collapsible/Accordion Blot

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
      <div class="collapsible-container">
        <button class="collapsible-header" type="button">
          <span class="collapsible-title">${data.title}</span>
          <span class="collapsible-chevron ${data.expanded ? 'is-expanded' : ''}">▼</span>
        </button>
        <div class="collapsible-content ${data.expanded ? '' : 'is-hidden'}">
          ${data.content}
        </div>
      </div>
    `;

    const button = node.querySelector('.collapsible-header');
    const content = node.querySelector('.collapsible-content');
    const chevron = node.querySelector('.collapsible-chevron');

    button?.addEventListener('click', () => {
      const isExpanded = node.getAttribute('data-expanded') === 'true';
      node.setAttribute('data-expanded', String(!isExpanded));
      content?.classList.toggle('is-hidden');
      chevron?.classList.toggle('is-expanded');
    });

    return node;
  }

  static value(node: HTMLElement): CollapsibleData {
    return {
      title: node.querySelector('.collapsible-title')?.textContent || '',
      content: node.querySelector('.collapsible-content')?.innerHTML || '',
      expanded: node.getAttribute('data-expanded') === 'true',
    };
  }
}

export default CollapsibleBlot;
```

### 4.4 Enhanced Code Block Blot

Syntax highlighting with language selector.

```typescript
// src/blots/CodeBlockBlot.ts

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export interface CodeBlockData {
  language: string;
  code: string;
}

const LANGUAGES = ['javascript', 'typescript', 'python', 'html', 'css', 'json'];

class CodeBlockBlot extends BlockEmbed {
  static blotName = 'code-block-enhanced';
  static tagName = 'div';
  static className = 'ql-code-block-enhanced';

  static create(data: CodeBlockData): HTMLElement {
    const node = super.create() as HTMLElement;

    node.setAttribute('data-language', data.language);
    node.setAttribute('contenteditable', 'false');

    const options = LANGUAGES.map(
      lang => `<option value="${lang}" ${lang === data.language ? 'selected' : ''}>${lang}</option>`
    ).join('');

    node.innerHTML = `
      <div class="code-block-container">
        <div class="code-block-header">
          <select class="code-block-language">${options}</select>
          <button class="code-block-copy" type="button">Copy</button>
        </div>
        <pre class="code-block-pre"><code class="language-${data.language}">${escapeHtml(data.code)}</code></pre>
      </div>
    `;

    // Copy button handler
    const copyBtn = node.querySelector('.code-block-copy');
    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(data.code);
      if (copyBtn) {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 2000);
      }
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

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default CodeBlockBlot;
```

### 4.5 Embed Blot (Video/Social)

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
        const videoId = extractYouTubeId(data.url);
        embedHtml = `
          <div class="embed-youtube">
            <iframe
              src="https://www.youtube.com/embed/${videoId}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        `;
        break;
      case 'twitter':
        embedHtml = `
          <div class="embed-twitter">
            <a href="${data.url}" target="_blank">View Tweet</a>
          </div>
        `;
        break;
      default:
        embedHtml = `
          <iframe src="${data.url}" class="embed-iframe" frameborder="0"></iframe>
        `;
    }

    node.innerHTML = `<div class="embed-wrapper">${embedHtml}</div>`;
    return node;
  }

  static value(node: HTMLElement): EmbedData {
    return {
      type: (node.getAttribute('data-type') as EmbedType) || 'iframe',
      url: node.getAttribute('data-url') || '',
    };
  }
}

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
  );
  return match?.[1] || '';
}

export default EmbedBlot;
```

---

## Phase 5: Complex Blots

This phase implements high-complexity blots with rich interactions.

### 5.1 Product Card Blot

Embedded product with image, price, and CTA button.

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
      <div class="product-card-container">
        <img
          src="${data.imageUrl}"
          alt="${data.title}"
          class="product-card-image"
        />
        <div class="product-card-body">
          <h4 class="product-card-title">${data.title}</h4>
          ${data.description ? `<p class="product-card-description">${data.description}</p>` : ''}
          <div class="product-card-footer">
            <span class="product-card-price">${data.currency}${data.price.toFixed(2)}</span>
            <a href="${data.productUrl}" target="_blank" class="product-card-cta">
              View Product
            </a>
          </div>
        </div>
      </div>
    `;

    return node;
  }

  static value(node: HTMLElement): ProductCardData {
    const img = node.querySelector('.product-card-image') as HTMLImageElement;
    const title = node.querySelector('.product-card-title');
    const price = node.querySelector('.product-card-price');
    const link = node.querySelector('.product-card-cta') as HTMLAnchorElement;
    const desc = node.querySelector('.product-card-description');

    const priceText = price?.textContent || '$0';
    const currency = priceText.replace(/[\d.]/g, '');
    const priceValue = parseFloat(priceText.replace(/[^\d.]/g, ''));

    return {
      id: node.getAttribute('data-id') || '',
      title: title?.textContent || '',
      price: priceValue,
      currency: currency || '$',
      imageUrl: img?.src || '',
      productUrl: link?.href || '',
      description: desc?.textContent || undefined,
    };
  }
}

export default ProductCardBlot;
```

### 5.2 Enhanced Table Blot

Table with headers support.

```typescript
// src/blots/TableBlot.ts

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
    node.setAttribute('contenteditable', 'false');

    const headerRow =
      data.headers && data.rows.length > 0
        ? `<thead><tr>${data.rows[0].map(cell => `<th>${cell}</th>`).join('')}</tr></thead>`
        : '';

    const bodyRows = (data.headers ? data.rows.slice(1) : data.rows)
      .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`)
      .join('');

    node.innerHTML = `
      <div class="table-wrapper">
        <table class="enhanced-table">
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
new Delta().insert({
  'enhanced-table': {
    headers: true,
    rows: [
      ['Name', 'Price', 'Stock'],
      ['Widget A', '$10', '50'],
      ['Widget B', '$20', '30'],
    ],
  },
});
```

---

## Phase 6: AI Assistant

This phase implements the "Ask Copilot" feature for AI-powered text editing.

### 6.1 AI Assistant Blot

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
        <span class="ai-loading">
          <span class="ai-spinner">⚙️</span>
          <span>AI is thinking...</span>
        </span>
      `;
    } else if (data.status === 'complete' && data.suggestion) {
      node.innerHTML = `
        <span class="ai-suggestion">
          <span class="ai-text">${data.suggestion}</span>
          <button class="ai-accept" title="Accept">✓</button>
          <button class="ai-reject" title="Reject">✗</button>
        </span>
      `;
    }

    return node;
  }

  static value(node: HTMLElement): AIAssistantData {
    return {
      id: node.getAttribute('data-id') || '',
      status: (node.getAttribute('data-status') as AIAssistantData['status']) || 'idle',
      originalText: '',
    };
  }
}

export default AIAssistantBlot;
```

### 6.2 AI Service

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
  improve: text => `${text} [improved with better clarity]`,
  simplify: text =>
    text
      .split(' ')
      .slice(0, Math.ceil(text.split(' ').length / 2))
      .join(' ') + '.',
  expand: text => `${text} Furthermore, this topic deserves additional exploration.`,
  'fix-grammar': text =>
    text.charAt(0).toUpperCase() + text.slice(1).replace(/\s+/g, ' ').trim() + '.',
  custom: text => `[Custom transformation of: "${text}"]`,
};

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const { text, action, useMock = true } = options;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (useMock) {
    return MOCK_RESPONSES[action](text);
  }

  // Real API call placeholder
  // const response = await fetch('/api/ai/generate', { ... });
  // return response.json();

  return MOCK_RESPONSES[action](text);
}
```

### 6.3 AI Assistant Module

```typescript
// src/modules/AIAssistantModule.ts

import Quill from 'quill';
import { generateText, AIPromptType } from '../utils/aiService';

export interface AIAssistantOptions {
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
    this.toolbar.className = 'ai-toolbar is-hidden';

    this.toolbar.innerHTML = `
      <div class="ai-toolbar-buttons">
        <button data-action="improve" class="ai-btn">✨ Improve</button>
        <button data-action="simplify" class="ai-btn">📝 Simplify</button>
        <button data-action="expand" class="ai-btn">📖 Expand</button>
        <button data-action="fix-grammar" class="ai-btn">🔤 Fix Grammar</button>
        <button data-action="custom" class="ai-btn ai-btn-primary">🤖 Ask Copilot</button>
      </div>
    `;

    this.toolbar.querySelectorAll('.ai-btn').forEach(btn => {
      btn.addEventListener('click', e => {
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
      this.toolbar.classList.remove('is-hidden');
    } else {
      this.toolbar.classList.add('is-hidden');
    }
  }

  async handleAction(action: AIPromptType) {
    const range = this.quill.getSelection();
    if (!range || range.length === 0) return;

    const selectedText = this.quill.getText(range.index, range.length);

    if (action === 'custom') {
      const prompt = window.prompt('What would you like to do with this text?');
      if (!prompt) return;
    }

    try {
      this.toolbar?.classList.add('is-hidden');

      const result = await generateText({
        text: selectedText,
        action,
        useMock: this.options.useMock,
      });

      this.quill.deleteText(range.index, range.length);
      this.quill.insertText(range.index, result);
    } catch (error) {
      console.error('AI Assistant error:', error);
    }
  }
}

export default AIAssistantModule;
```

### 6.4 Registering AI Module

```typescript
// src/modules/index.ts

import Quill from 'quill';
import AIAssistantModule from './AIAssistantModule';

export function registerModules() {
  Quill.register('modules/aiAssistant', AIAssistantModule);
}
```

### 6.5 Using AI Module in Editor

```typescript
// In Editor initialization
const quill = new Quill(container, {
  theme: 'snow',
  modules: {
    toolbar: [...],
    aiAssistant: {
      useMock: true,
    },
  },
});
```

---

## Implementation Checklist

### Phase 0: Project Setup

- [ ] Initialize Vite project with React + TypeScript
- [ ] Install all dependencies
- [ ] Configure ESLint (`eslint.config.js`)
- [ ] Configure Prettier (`.prettierrc`, `.prettierignore`)
- [ ] Configure Stylelint (`.stylelintrc.json`)
- [ ] Setup Husky with lint-staged
- [ ] Create SCSS structure (`_variables.scss`, `_mixins.scss`, `index.scss`)
- [ ] Configure Vite for SCSS
- [ ] Setup GitHub Actions CI (`.github/workflows/ci.yml`)
- [ ] Verify all linting passes

### Phase 1: Core Editor

- [ ] Create Editor component with forwardRef
- [ ] Implement TypeScript interfaces
- [ ] Add callback ref pattern
- [ ] Setup Quill initialization in useEffect
- [ ] Add proper cleanup on unmount
- [ ] Create Editor SCSS styles
- [ ] Test basic editor functionality

### Phase 2: Dark Theme

- [ ] Create ThemeProvider context
- [ ] Create useTheme hook
- [ ] Create ThemeToggle component
- [ ] Add CSS custom properties for theming
- [ ] Create `_dark-theme.scss` with Quill overrides
- [ ] Test theme persistence in localStorage

### Phase 3: Simple Blots

- [ ] Create blots registration (`src/blots/index.ts`)
- [ ] Implement Divider Blot (5 variants)
- [ ] Implement Alert Blot (4 types)
- [ ] Create `_blots.scss` styles
- [ ] Test Delta serialization/deserialization

### Phase 4: Medium Complexity Blots

- [ ] Implement Mention Blot
- [ ] Implement Checklist Blot (interactive checkboxes)
- [ ] Implement Collapsible Blot
- [ ] Implement Code Block Blot (with copy button)
- [ ] Implement Embed Blot (YouTube, Twitter)
- [ ] Add styles for all blots
- [ ] Test all interactions

### Phase 5: Complex Blots

- [ ] Implement Product Card Blot
- [ ] Implement Enhanced Table Blot
- [ ] Add dark mode support for complex blots
- [ ] Test all blots

### Phase 6: AI Assistant

- [ ] Create AI Service with mock responses
- [ ] Implement AI Assistant Blot
- [ ] Create AI Assistant Module
- [ ] Add selection-based toolbar
- [ ] Implement all AI actions (improve, simplify, expand, fix-grammar, custom)
- [ ] Test AI integration

### Phase 7: Demo & Documentation

- [ ] Create demo page with all blots
- [ ] Add sample content
- [ ] Test Delta export/import
- [ ] Deploy to Vercel/Netlify
- [ ] Verify CI/CD pipeline

---

## References

### Quill

- [Quill Documentation](https://quilljs.com/docs)
- [Quill React Playground](https://quilljs.com/playground/react)
- [Delta Documentation](https://quilljs.com/docs/delta)
- [Parchment (Blot API)](https://github.com/slab/parchment)

### Development Tools

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Stylelint Documentation](https://stylelint.io/)
- [Husky Documentation](https://typicode.github.io/husky/)
