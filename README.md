# My AI Usage Audit

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State-7D4CDB)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-EF008F?logo=framer)
![Static Export](https://img.shields.io/badge/Deploy-Static_Export-22C55E)

AI 코딩 습관을 진단하는 인터랙티브 웹앱입니다.  
7개 시나리오 기반 퀴즈를 통해 사용 패턴을 분석하고, 결과 캐릭터/약점 카테고리/개선 가이드를 제공합니다.

## Screenshots

![Landing Desktop](./docs/assets/screenshots/landing-desktop.png)

### Flow (Quiz to Result)

![Quiz to Result GIF](./docs/assets/screenshots/quiz-to-result.gif)

## Key Features

- 7문항 시나리오 퀴즈 + 실시간 진행 상태
- 토큰 효율 게이지/시스템 로그 기반 피드백 UI
- 결과 페이지: 캐릭터 카드 + 레이더 차트 + 개선 인사이트
- 결과 카드 이미지 내보내기/공유
- `KO / EN` 다국어 전환
- 레트로 터미널 테마 반응형 UI (모바일 포함)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Zustand
- Framer Motion
- Static Export (`output: "export"`)

## Project Structure

```text
src/
  app/
    page.tsx           # Landing
    quiz/page.tsx      # Quiz
    result/page.tsx    # Result
  components/
    quiz/
    result/
    common/
  data/
    questions.ko.ts
    questions.en.ts
    characters.ts
  i18n/
    store.ts
    messages.ts
  store/
    useQuizStore.ts
```

## Local Development

```bash
pnpm install
pnpm dev
```

- Local URL: `http://localhost:3000`

## Build & Verify

```bash
pnpm lint
pnpm tsc --noEmit
pnpm build
```

## Deployment

이 프로젝트는 정적 배포를 기본으로 구성되어 있습니다.

- 설정: `next.config.ts` → `output: "export"`
- 산출물: `out/`
- 추천: Vercel 또는 GitHub Pages

## Docs

- [PRD](./docs/PRD.md)
- [TRD](./docs/TRD.md)
- [Design Spec](./docs/design-spec.md)
- [User Flow](./docs/user-flow.md)

## Repository

- GitHub: https://github.com/gloriaJun/my-ai-usage-audit
