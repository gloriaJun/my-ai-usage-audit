# CLAUDE.md

## Project Overview

개발자의 AI 도구 사용 습관을 진단하는 인터랙티브 퀴즈 웹 서비스 (레트로 터미널 UI).

- [PRD](docs/PRD.md) - 요구사항, 7문항 카테고리, 캐릭터 시스템
- [TRD](docs/TRD.md) - 기술 스택, Static Export 배포 전략, 컴포넌트 구조
- [User Flow](docs/user-flow.md) - 사용자 여정, 퀴즈/결과 플로우, 상태 다이어그램
- [Design Reference](docs/stich-main.html) - Stitch UI 디자인 (터미널 테마, 컬러 토큰)

## Tech Stack

Next.js 14+ (App Router, Static Export) / TypeScript / Tailwind CSS + Shadcn/ui / Framer Motion / Zustand

## Commands

```bash
pnpm install         # Install dependencies
pnpm dev             # Start dev server
pnpm build           # Static build → out/
pnpm preview         # Preview static build
pnpm lint            # Run linter
```

## Key Constraints

- Static Export (`output: 'export'`): No SSR, No API Routes, No middleware
- All data bundled in `questions.json` (no API calls)
- Client-only: Canvas API for share image generation
