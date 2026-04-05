# My AI Usage Audit - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive quiz web service that diagnoses developers' AI tool usage habits with a retro terminal UI.

**Architecture:** Next.js 14 App Router with Static Export. Three pages (Landing, Quiz, Result) sharing a Zustand store. All quiz data bundled as static JSON. Terminal-themed UI with CRT effects, typing animations, and gauge visualizations via Framer Motion + SVG.

**Tech Stack:** Next.js 14 (App Router, Static Export) / TypeScript / Tailwind CSS v4 / Framer Motion / Zustand

---

## File Structure

```
src/
  app/
    layout.tsx            # Root layout with Space Grotesk font, CRT overlay
    page.tsx              # Landing page (boot animation → START AUDIT)
    quiz/page.tsx         # Quiz page (7-step quiz flow)
    result/page.tsx       # Result page (character + tips + share)
    globals.css           # Tailwind directives + CRT/glow custom styles
  components/
    CrtOverlay.tsx        # Fixed CRT scanline overlay (CSS only)
    TopBar.tsx            # Header: logo + step indicator or retry button
    StatusFooter.tsx      # Footer: SYSTEM_LIVE + fake stats
    quiz/
      QuizTerminal.tsx    # Scenario display with typing animation
      OptionButtons.tsx   # 3-4 selectable option buttons
      TokenGauge.tsx      # SVG half-circle gauge with animated needle
      SystemLog.tsx       # Terminal log feed with auto-scroll
      ProgressBar.tsx     # Block-style progress bar (N/7)
    result/
      CharacterCard.tsx   # ASCII art + name + rank + description + strengths/weaknesses
      RadarChart.tsx      # 7-axis SVG radar chart
      InsightPanel.tsx    # Category-specific tips with code snippets + copy
      ActionBar.tsx       # Export/Share/Retry buttons
  data/
    questions.ts          # 7 questions with options (score, tokenImpact, logMessage)
    characters.ts         # 5 character definitions (thresholds, descriptions, tips)
  store/
    useQuizStore.ts       # Zustand: currentStep, answers, scores, logs, character
  lib/
    scoring.ts            # Score calculation + character determination
    shareImage.ts         # Canvas API image generation for sharing
  types/
    index.ts              # Question, Option, Character, QuizState interfaces
```

---

## Chunk 1: Project Scaffolding + Data Layer

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Scaffold Next.js project with pnpm**

```bash
cd /Users/al03155147/Documents/GitHub/my-ai-usage-audit
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-pnpm
```

Expected: Project scaffolded with App Router + TypeScript + Tailwind

- [ ] **Step 2: Configure Static Export**

In `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

- [ ] **Step 3: Install dependencies**

```bash
pnpm add framer-motion zustand
```

- [ ] **Step 4: Add Space Grotesk font to layout**

In `src/app/layout.tsx`, import Space Grotesk from `next/font/google` and apply to body.

- [ ] **Step 5: Set up globals.css with terminal theme base**

Custom styles for CRT overlay, glow effects, cursor blink animation, terminal borders. Colors: `#131313` background, `#00FF41` primary green, `#FFB4AB` error red, `#FDAF00` amber.

- [ ] **Step 6: Verify dev server runs**

```bash
pnpm dev
```

Expected: App runs at localhost:3000

- [ ] **Step 7: Verify static build works**

```bash
pnpm build
```

Expected: `out/` directory created with static files

- [ ] **Step 8: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with static export config"
```

---

### Task 2: Define Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create type definitions**

```typescript
export interface Option {
  text: string;
  score: number;
  tokenImpact: number;
  logMessage: string;
}

export interface Question {
  id: string;
  category: string;
  scenario: string;
  options: Option[];
  insight: string;
}

export interface Character {
  id: string;
  name: string;
  rank: "S" | "A" | "B" | "C";
  description: string;
  asciiArt: string;
  colorAccent: string;
  condition: {
    skillMin: number;
    skillMax: number;
    efficiencyMin: number;
    efficiencyMax: number;
  };
}

export interface CategoryTip {
  category: string;
  guide: string;
  snippet?: string;
}

export interface QuizState {
  currentStep: number;
  answers: Record<string, number>; // questionId -> optionIndex
  totalScore: number;
  totalTokenImpact: number;
  categoryScores: Record<string, { score: number; tokenImpact: number }>;
  logMessages: string[];
  character: Character | null;
  // Actions
  selectOption: (questionId: string, optionIndex: number, option: Option) => void;
  nextStep: () => void;
  calculateResult: () => void;
  reset: () => void;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types && git commit -m "feat: add type definitions for quiz, character, and state"
```

---

### Task 3: Create Quiz Data

**Files:**
- Create: `src/data/questions.ts`
- Create: `src/data/characters.ts`

- [ ] **Step 1: Create questions data (7 questions)**

Each question has: id, category, scenario (Korean), 3-4 options with score (0-3), tokenImpact (0-3), logMessage.

Categories: session, prompt, error, code-review, memory, tool, workflow

Scoring guide:
- score: 0=worst, 3=best practice
- tokenImpact: 0=wasteful, 3=most efficient

- [ ] **Step 2: Create character definitions (5 characters)**

| Character | Skill | Efficiency | Rank | Color |
|-----------|-------|------------|------|-------|
| Token Alchemist | >= 15 | >= 15 | S | #33FF33 |
| Prompt Architect | >= 15 | 8-14 | A | #33FF33 |
| Copy-Paste Gambler | < 11 | >= 15 | B | #FDAF00 |
| Brute Force Coder | 8-14 | < 11 | B | #FDAF00 |
| Hopeful Beginner | < 11 | < 11 | C | #FFB4AB |

Each character includes: name, rank, description (Korean), asciiArt, colorAccent, condition ranges, categoryTips.

- [ ] **Step 3: Commit**

```bash
git add src/data && git commit -m "feat: add quiz questions and character data"
```

---

### Task 4: Create Scoring Logic

**Files:**
- Create: `src/lib/scoring.ts`

- [ ] **Step 1: Implement score calculation and character determination**

```typescript
import { Character, Option } from "@/types";
import { characters } from "@/data/characters";

export function determineCharacter(
  totalScore: number,
  totalTokenImpact: number
): Character {
  // Match against character conditions, fallback to Hopeful Beginner
}

export function getRank(character: Character): string {
  return `${character.rank}-RANK`;
}

export function getWeakCategories(
  categoryScores: Record<string, { score: number; tokenImpact: number }>
): string[] {
  // Return categories where score < max possible (3)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/scoring.ts && git commit -m "feat: add scoring logic and character determination"
```

---

### Task 5: Create Zustand Store

**Files:**
- Create: `src/store/useQuizStore.ts`

- [ ] **Step 1: Implement quiz store**

```typescript
import { create } from "zustand";
import { QuizState, Option } from "@/types";
import { questions } from "@/data/questions";
import { determineCharacter } from "@/lib/scoring";

export const useQuizStore = create<QuizState>((set, get) => ({
  currentStep: 0,
  answers: {},
  totalScore: 0,
  totalTokenImpact: 0,
  categoryScores: {},
  logMessages: [],
  character: null,

  selectOption: (questionId, optionIndex, option) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    set(state => ({
      answers: { ...state.answers, [questionId]: optionIndex },
      totalScore: state.totalScore + option.score,
      totalTokenImpact: state.totalTokenImpact + option.tokenImpact,
      categoryScores: {
        ...state.categoryScores,
        [question.category]: {
          score: (state.categoryScores[question.category]?.score ?? 0) + option.score,
          tokenImpact: (state.categoryScores[question.category]?.tokenImpact ?? 0) + option.tokenImpact,
        },
      },
      logMessages: [...state.logMessages, option.logMessage],
    }));
  },

  nextStep: () => set(state => ({ currentStep: state.currentStep + 1 })),

  calculateResult: () => {
    const { totalScore, totalTokenImpact } = get();
    const character = determineCharacter(totalScore, totalTokenImpact);
    set({ character });
  },

  reset: () => set({
    currentStep: 0,
    answers: {},
    totalScore: 0,
    totalTokenImpact: 0,
    categoryScores: {},
    logMessages: [],
    character: null,
  }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/store && git commit -m "feat: add Zustand quiz store with scoring integration"
```

---

## Chunk 2: Shared Layout Components

### Task 6: CRT Overlay

**Files:**
- Create: `src/components/CrtOverlay.tsx`

- [ ] **Step 1: Create CRT scanline overlay component**

Fixed position div with CSS-only scanline effect using linear gradients (from stich-main.html). `pointer-events: none`, `z-index: 100`.

- [ ] **Step 2: Add to root layout**

- [ ] **Step 3: Commit**

```bash
git add src/components/CrtOverlay.tsx src/app/layout.tsx && git commit -m "feat: add CRT scanline overlay effect"
```

---

### Task 7: TopBar

**Files:**
- Create: `src/components/TopBar.tsx`

- [ ] **Step 1: Create TopBar component**

Props: `mode: "quiz" | "result"`, `currentStep?: number` (for quiz), `onRetry?: () => void` (for result).

Quiz mode: Logo `MY-AI-USAGE-AUDIT` + `STEP 0N/07` + mini progress bar.
Result mode: Logo `AUDIT_COMPLETE` + retry button.

Styled with: fixed top, `#131313` bg, `#00FF41` green text, `border-b border-[#3B4B37]/20`.

- [ ] **Step 2: Commit**

```bash
git add src/components/TopBar.tsx && git commit -m "feat: add TopBar component with quiz/result modes"
```

---

### Task 8: StatusFooter

**Files:**
- Create: `src/components/StatusFooter.tsx`

- [ ] **Step 1: Create footer component**

Fixed bottom bar with: `SYSTEM_LIVE` indicator (pulsing green dot) + fake system stats (`CPU_TEMP`, `MEM_USAGE`, `UPTIME` with ticking timer). Styled from stich-main.html footer.

- [ ] **Step 2: Commit**

```bash
git add src/components/StatusFooter.tsx && git commit -m "feat: add StatusFooter with system live indicator"
```

---

## Chunk 3: Quiz Page Components

### Task 9: ProgressBar

**Files:**
- Create: `src/components/quiz/ProgressBar.tsx`

- [ ] **Step 1: Create block-style progress bar**

7 blocks, filled blocks use `bg-[#00FF41]`, empty use `bg-[#3B4B37]/30`. Accepts `currentStep` prop (0-6). Framer Motion `layoutId` for smooth fill animation.

- [ ] **Step 2: Commit**

```bash
git add src/components/quiz && git commit -m "feat: add block-style progress bar"
```

---

### Task 10: TokenGauge

**Files:**
- Create: `src/components/quiz/TokenGauge.tsx`

- [ ] **Step 1: Create SVG half-circle gauge**

Port the gauge SVG from stich-main.html. Props: `value: number` (0-21, max tokenImpact). Needle rotation animated with Framer Motion `spring`. Green→Yellow→Red gradient arc. Labels: SAFE / WARNING / CRITICAL based on value thresholds.

- [ ] **Step 2: Commit**

```bash
git add src/components/quiz/TokenGauge.tsx && git commit -m "feat: add animated token gauge with SVG needle"
```

---

### Task 11: SystemLog

**Files:**
- Create: `src/components/quiz/SystemLog.tsx`

- [ ] **Step 1: Create terminal log feed**

Props: `messages: string[]`. Displays timestamped log entries with auto-scroll to bottom. Mono font, `text-[11px]`, green text. New entries animate in with Framer Motion `AnimatePresence`. Shows latest 2-3 on mobile, scrollable on desktop.

- [ ] **Step 2: Commit**

```bash
git add src/components/quiz/SystemLog.tsx && git commit -m "feat: add system event log with auto-scroll"
```

---

### Task 12: QuizTerminal + OptionButtons

**Files:**
- Create: `src/components/quiz/QuizTerminal.tsx`
- Create: `src/components/quiz/OptionButtons.tsx`

- [ ] **Step 1: Create QuizTerminal**

Displays current question scenario with typing animation effect (Framer Motion or interval-based character reveal). Shows boot-up log lines before scenario. Double-border terminal window style from stich-main.html.

- [ ] **Step 2: Create OptionButtons**

3-4 buttons per question. On click: flash selected → fade others → trigger store update → advance to next step after 800ms delay. Terminal button styling (`btn-terminal`). Hover: green bg + glow. Grid layout: 2-col on mobile, 4-col on desktop (when 4 options).

- [ ] **Step 3: Commit**

```bash
git add src/components/quiz && git commit -m "feat: add quiz terminal with typing animation and option buttons"
```

---

### Task 13: Quiz Page Assembly

**Files:**
- Create: `src/app/quiz/page.tsx`

- [ ] **Step 1: Assemble quiz page**

`"use client"` page. Layout:
- TopBar (quiz mode)
- Mobile: TokenGauge (compact) → Terminal → SystemLog (2-3 lines)
- Desktop: 2-column grid (Terminal left 8/12, Gauge+Log right 4/12)
- StatusFooter

Wire up Zustand store. On last question completion → `calculateResult()` → `router.push('/result')`.

- [ ] **Step 2: Verify quiz flow works end-to-end**

```bash
pnpm dev
```

Navigate through all 7 questions, verify store updates.

- [ ] **Step 3: Commit**

```bash
git add src/app/quiz && git commit -m "feat: assemble quiz page with responsive layout"
```

---

## Chunk 4: Result Page Components

### Task 14: CharacterCard

**Files:**
- Create: `src/components/result/CharacterCard.tsx`

- [ ] **Step 1: Create character card**

Displays: ASCII art (pre tag, mono font, crt-glow), character name (large bold), rank badge (S/A/B/C-RANK with color accent), one-line description, strengths (top 2 categories), weaknesses (bottom 2 categories). Styled from stich-result.html character section.

- [ ] **Step 2: Commit**

```bash
git add src/components/result && git commit -m "feat: add character card with ASCII art and rank badge"
```

---

### Task 15: RadarChart

**Files:**
- Create: `src/components/result/RadarChart.tsx`

- [ ] **Step 1: Create 7-axis SVG radar chart**

Props: `categoryScores: Record<string, { score: number; tokenImpact: number }>`. 7 axes: Session, Prompt, Error, Code, Memory, Tool, Workflow. Background: 3 concentric heptagon grids (33%, 66%, 100%). Data polygon: `fill: rgba(51, 255, 51, 0.2)`, `stroke: #33FF33`. Axis labels in green. Framer Motion: polygon draws in on mount.

- [ ] **Step 2: Commit**

```bash
git add src/components/result/RadarChart.tsx && git commit -m "feat: add 7-axis radar chart SVG component"
```

---

### Task 16: InsightPanel

**Files:**
- Create: `src/components/result/InsightPanel.tsx`

- [ ] **Step 1: Create actionable insights panel**

Shows tips for categories where score < max. Each tip: category name + score, 1-2 line guide text, optional code snippet with copy button. Copy uses `navigator.clipboard.writeText()`. Collapsible/expandable sections. Tips data sourced from `characters.ts`.

- [ ] **Step 2: Commit**

```bash
git add src/components/result/InsightPanel.tsx && git commit -m "feat: add insight panel with copyable code snippets"
```

---

### Task 17: ActionBar + Share Image

**Files:**
- Create: `src/components/result/ActionBar.tsx`
- Create: `src/lib/shareImage.ts`

- [ ] **Step 1: Create Canvas-based share image generator**

`generateShareImage(character, categoryScores)`: Creates a canvas with character card (name, rank, ASCII art, scores). Returns `blob` for download or sharing.

- [ ] **Step 2: Create ActionBar**

Three buttons:
- `EXPORT_CARD`: Call `generateShareImage()` → trigger PNG download
- `SHARE_RESULT`: Web Share API (if available) or fallback to clipboard link copy
- `RETRY_AUDIT`: Reset store → navigate to `/`

- [ ] **Step 3: Commit**

```bash
git add src/components/result src/lib/shareImage.ts && git commit -m "feat: add action bar with export, share, and retry"
```

---

### Task 18: Result Page Assembly

**Files:**
- Create: `src/app/result/page.tsx`

- [ ] **Step 1: Assemble result page**

`"use client"` page. Redirect to `/` if no character in store. Layout:
- TopBar (result mode with retry)
- Mobile: CharacterCard → RadarChart → InsightPanel → SystemLog (3 lines) → ActionBar
- Desktop: 2-column (CharacterCard left 5/12, RadarChart right 7/12) → InsightPanel full → Log → ActionBar
- StatusFooter
- Scrollable (`overflow-y: auto`)

- [ ] **Step 2: Commit**

```bash
git add src/app/result && git commit -m "feat: assemble result page with responsive layout"
```

---

## Chunk 5: Landing Page + Polish

### Task 19: Landing Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create landing page with boot animation**

Terminal boot sequence animation:
1. Show fake boot lines with typing effect (INITIALIZING KERNEL AUDIT..., SCANNING AGENTS..., etc.)
2. After boot completes (~2s), show `START AUDIT` button with glow effect
3. Button click → `router.push('/quiz')`

ASCII art title display. Full-screen terminal window feel.

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx && git commit -m "feat: add landing page with terminal boot animation"
```

---

### Task 20: Final Integration + Build Verification

- [ ] **Step 1: Full flow test**

```bash
pnpm dev
```

Test: Landing → Start → Quiz (7 steps) → Result → Share → Retry

- [ ] **Step 2: Static build test**

```bash
pnpm build && pnpm preview
```

Verify all pages work as static files.

- [ ] **Step 3: Responsive check**

Test at 375px (mobile), 768px (tablet), 1024px+ (desktop).

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "feat: complete My AI Usage Audit app"
```
