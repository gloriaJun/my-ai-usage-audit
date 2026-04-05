# TRD: My AI Usage Audit - Technical Specifications

## 1. Tech Stack

- **Framework:** Next.js 14+ (App Router, Static Export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui (Dark Theme)
- **Animation:** Framer Motion (Terminal typing, gauge transitions)
- **State Management:** Zustand (클라이언트 전용, 서버 상태 불필요)
- **Deployment:** 정적 호스팅 (GitHub Pages, Vercel, Netlify, Cloudflare Pages 등)

## 2. 배포 전략 (Static Export)

### 2.1. 정적 빌드 구성

Next.js Static Export(`output: 'export'`)를 사용하여 완전한 클라이언트 사이드 앱으로 구성한다.

- `next.config.js`에서 `output: 'export'` 설정
- 빌드 결과물은 `out/` 디렉토리에 정적 파일(HTML, CSS, JS)로 생성
- 서버 컴포넌트 및 API Route 없이 순수 클라이언트 렌더링으로 동작

### 2.2. 기술 스택 영향도

| 영역 | 정적 배포 반영 사항 |
|------|---------------------|
| **State Management** | Zustand로 클라이언트 전용 상태 관리. 서버 상태 동기화 불필요 |
| **데이터** | 모든 퀴즈 데이터는 `questions.json` 파일로 번들에 포함 (API 호출 없음) |
| **라우팅** | Next.js App Router의 정적 라우팅만 사용. 동적 라우트는 `generateStaticParams`로 사전 생성 |
| **이미지/공유** | 클라이언트 사이드에서 Canvas API로 캐릭터 카드 이미지 생성 |

### 2.3. 빌드 & 배포 커맨드

```bash
pnpm build    # next build → out/ 디렉토리에 정적 파일 생성
pnpm preview  # 로컬에서 정적 빌드 미리보기
```

### 2.4. 정적 배포 제약사항

Static Export 환경에서는 다음 Next.js 기능을 사용할 수 없다.

- **SSR / ISR:** 서버 사이드 렌더링 및 증분 정적 재생성 사용 불가
- **API Routes:** `/api/*` 엔드포인트 사용 불가. 모든 로직은 클라이언트에서 처리
- **Middleware:** `middleware.ts` 사용 불가. 라우트 가드 등은 클라이언트 로직으로 대체
- **동적 라우팅:** `generateStaticParams`를 통해 빌드 시점에 모든 경로를 사전 생성해야 함

## 3. Architecture & Components

### 3.1. Layout System

- **Terminal Shell:** 전체 웹 페이지를 감싸는 Retro-Terminal UI 컨테이너.
- **Navigation:** 간단한 상태 표시줄 (Current Session, Token Usage Indicator).

### 3.2. Quiz Engine Logic

- `questions.json`: 질문 데이터 구조화. 번들에 정적으로 포함되어 API 호출 없이 사용.
  ```typescript
  interface Question {
    id: string;
    scenario: string;
    options: {
      text: string;
      score: number;
      tokenImpact: number;
      logMessage: string;
    }[];
    insight: string;
  }
  ```
