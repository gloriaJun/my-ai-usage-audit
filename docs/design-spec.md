# Design Spec: My AI Usage Audit

Stitch 디자인(stich-main.html, stich-result.html)을 PRD 요구사항에 맞게 보완한 화면 설계 문서.

## 공통 디자인 시스템

### 레이아웃 원칙

- **사이드바 제거**: 퀴즈/결과 모두 싱글 컬럼 중심 레이아웃. 기능 없는 장식 네비게이션 제거
- **모바일 퍼스트**: 싱글 컬럼 → 데스크탑에서 2컬럼 확장
- **풀 스크린 터미널**: 전체 화면이 하나의 터미널 윈도우

### 비주얼 토큰 (Stitch 유지)

| 요소 | 값 |
|---|---|
| Background | `#131313` |
| Primary (Green) | `#00FF41` / `#33FF33` |
| Error (Red) | `#FFB4AB` |
| Secondary (Amber) | `#FDAF00` (결과 페이지) |
| Font | Space Grotesk |
| Border Radius | 0px (전체) |
| Effects | CRT scanlines, glow text-shadow, glow box-shadow |

---

## 1. 메인 화면 (Quiz)

### 와이어프레임

```
┌─────────────────────────────────────────────┐
│ TOP BAR                                     │
│ [MY-AI-USAGE-AUDIT]    STEP 03/07 ████░░░  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─ TERMINAL WINDOW ─────────────────────┐  │
│  │ [ 0.000000] INITIALIZING AUDIT...     │  │
│  │ [ 0.043512] SCANNING AGENTS...        │  │
│  │                                       │  │
│  │ ┌─ SCENARIO ────────────────────────┐ │  │
│  │ │ CRITICAL_DECISION_POINT           │ │  │
│  │ │                                   │ │  │
│  │ │ AI Agent가 full system access를   │ │  │
│  │ │ 요청하고 있다. 어떻게 할 것인가?_ │ │  │
│  │ └───────────────────────────────────┘ │  │
│  │                                       │  │
│  │ ┌─ OPTIONS ─────────────────────────┐ │  │
│  │ │ > GRANT ACCESS                    │ │  │
│  │ │ > DENY                            │ │  │
│  │ │ > SANDBOX ONLY                    │ │  │
│  │ │ > LOG & ANALYZE                   │ │  │
│  │ └───────────────────────────────────┘ │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ SIDE PANEL (Desktop: 우측) ──────────┐  │
│  │ TOKEN_GAUGE  [반원 게이지]             │  │
│  │              SAFE ──── CRITICAL        │  │
│  ├────────────────────────────────────────┤  │
│  │ SYSTEM_LOG                             │  │
│  │ 14:02:33 AGENT_04 READ /etc/shadow    │  │
│  │ 14:02:34 HIGH_RISK_DETECTED           │  │
│  │ 14:02:35 ⚠ BUFFER OVERFLOW 0x00F3A2  │  │
│  └────────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│ FOOTER: ● SYSTEM_LIVE  CPU:42°C MEM:64.2GB │
└─────────────────────────────────────────────┘
```

### Stitch 대비 변경점

| 항목 | Stitch (현재) | 보완 |
|---|---|---|
| 사이드바 | 좌측 64px 고정 (DIAGNOSTICS, LEAK_DETECTION 등) | **제거**. 기능 없는 장식 요소 |
| Progress | 상단 `STEP 01/07` 텍스트만 | **블록형 Progress Bar를 Top Bar에 통합** |
| Token Gauge | 우측 독립 패널 | **모바일: 터미널 위에 소형 배치 / 데스크탑: 우측 패널** |
| Data Stream | 우측 바이너리 장식 영역 | **제거**. 공간 확보를 위해 System Log로 통합 |
| System Log | 하단 독립 섹션 | **사이드 패널 하단으로 이동** (Gauge 아래) |

### 반응형 전략

```
Mobile (< 768px):
┌──────────────┐
│ Top Bar      │  Progress Bar 포함
├──────────────┤
│ Token Gauge  │  소형, 가로 배치
├──────────────┤
│ Terminal     │  시나리오 + 선택지
├──────────────┤
│ System Log   │  최근 2-3줄만 표시
├──────────────┤
│ Footer       │
└──────────────┘

Desktop (>= 1024px):
┌──────────────────────────────────────┐
│ Top Bar + Progress                   │
├──────────────────────┬───────────────┤
│                      │ Token Gauge   │
│ Terminal Window      ├───────────────┤
│ (시나리오 + 선택지)  │ System Log    │
│                      │ (스크롤)      │
├──────────────────────┴───────────────┤
│ Footer                               │
└──────────────────────────────────────┘
```

### 인터랙션 정의

| 트리거 | 애니메이션 | 대상 |
|---|---|---|
| 스텝 전환 | 타이핑 애니메이션으로 새 시나리오 출력 | Terminal Window |
| 선택지 클릭 | 선택 버튼 flash → 다른 버튼 fade out | Options |
| 선택 후 | 바늘 이동 (Framer Motion spring) | Token Gauge |
| 선택 후 | 새 로그 라인 추가 + auto-scroll | System Log |
| 선택 후 | 블록 하나 채워짐 | Progress Bar |

---

## 2. 결과 화면 (Result)

### 와이어프레임

```
┌─────────────────────────────────────────────┐
│ TOP BAR                                     │
│ [AUDIT_COMPLETE]              [다시 하기 ↻] │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─ CHARACTER CARD ──┬─ RADAR CHART ─────┐  │
│  │                   │                   │  │
│  │   .--------.      │    Session        │  │
│  │  / .------. \     │     ╱    ╲        │  │
│  │  | |  X  X| |     │ Workflow  Prompt  │  │
│  │  | |  ..  | |     │   │    ╳    │     │  │
│  │  | '------' |     │ Tool    Error     │  │
│  │   '--------'      │     ╲    ╱        │  │
│  │                   │    Memory  Code   │  │
│  │ TOKEN ALCHEMIST   │    Review         │  │
│  │ ─── S-RANK ───    │                   │  │
│  │                   │                   │  │
│  │ "최소 토큰으로    │                   │  │
│  │  최대 결과를      │                   │  │
│  │  뽑아내는 마법사" │                   │  │
│  │                   │                   │  │
│  │ ● 강점: 세션 관리,│                   │  │
│  │   프롬프트 품질   │                   │  │
│  │ ○ 약점: 도구 활용 │                   │  │
│  └───────────────────┴───────────────────┘  │
│                                             │
│  ┌─ ACTIONABLE INSIGHTS ─────────────────┐  │
│  │                                       │  │
│  │ ▼ Session 관리 (점수: 2/3)            │  │
│  │   컨텍스트가 커지면 /compact로 요약   │  │
│  │   후 작업을 이어가세요.               │  │
│  │                                       │  │
│  │ ▼ 도구 활용 (점수: 1/3) ⚠            │  │
│  │   여러 파일 수정 시 Agent 모드를      │  │
│  │   활용하면 병렬 처리가 가능합니다.    │  │
│  │   ┌────────────────────────────┐      │  │
│  │   │ # CLAUDE.md snippet        │ [📋] │  │
│  │   │ ## Agent Usage             │      │  │
│  │   │ - Use /agent for multi...  │      │  │
│  │   └────────────────────────────┘      │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ SYSTEM_ANALYSIS_LOG ─────────────────┐  │
│  │ 0x001  DIAGNOSTIC COMPLETE            │  │
│  │ 0x002  TOKEN RATIO: 1.0023            │  │
│  │ 0x003  S-RANK STATUS CONFIRMED        │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ ACTIONS ─────────────────────────────┐  │
│  │ [📥 EXPORT_CARD]  [📤 SHARE_RESULT]  │  │
│  └───────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│ FOOTER                                      │
└─────────────────────────────────────────────┘
```

### Stitch 대비 변경점

| 항목 | Stitch (현재) | 보완 |
|---|---|---|
| 사이드바 | 좌측 OVERVIEW/ANALYTICS 등 | **제거** |
| 레이더 차트 축 | SKILL/FLOW/LOGIC/DRIVE (4축) | **7개 카테고리 축**으로 변경 (Session/Prompt/Error/Code/Memory/Tool/Workflow) |
| 캐릭터 설명 | 이름 + S-RANK만 표시 | **한 줄 설명 + 강점/약점 분석** 추가 |
| Actionable Insights | **없음** | **신규 추가**. 약한 카테고리별 개선 팁 + 코드 스니펫 복사 |
| System Analysis | 장식용 로그 8줄 | **축소**. 실제 진단 요약 3-4줄로 간결하게 |
| 다시 하기 | **없음** | Top Bar에 **RETRY 버튼** 추가 |
| 스크롤 | `overflow: hidden` (스크롤 불가) | **세로 스크롤 허용**. 팁 영역이 길어질 수 있음 |

### 결과 페이지 섹션 구성

#### A. Character Card (좌측 / 모바일: 상단)

- ASCII 아트 캐릭터 (Stitch 유지)
- 캐릭터명: `TOKEN ALCHEMIST`
- 등급 배지: `S-RANK` / `A-RANK` / `B-RANK` / `C-RANK`
- 한 줄 설명: "최소 토큰으로 최대 결과를 뽑아내는 마법사"
- 강점/약점: 7개 카테고리 중 상위 2개 / 하위 2개 표시

#### B. Radar Chart (우측 / 모바일: 카드 아래)

- **7각형 레이더**: 7개 카테고리 각각의 점수를 시각화
- 축 라벨: Session / Prompt / Error / Code / Memory / Tool / Workflow
- 데이터 폴리곤: `fill: rgba(51, 255, 51, 0.2)`, `stroke: #33FF33`
- 배경 그리드: 동심 7각형 3단계 (33%, 66%, 100%)

#### C. Actionable Insights (전체 폭)

- 낮은 점수 카테고리만 노출 (점수가 최적이 아닌 항목)
- 각 항목 구성:
  - 카테고리명 + 획득 점수
  - 1-2줄 개선 가이드 텍스트
  - (해당 시) 복사 가능한 코드 스니펫 (CLAUDE.md 템플릿, 커맨드 등)
  - `[📋 복사]` 버튼 → 클립보드 복사 (PRD 성공지표: 팁 복사율 > 30%)
- 아코디언 or 펼침 형태

#### D. Actions (하단 고정)

| 버튼 | 기능 | 구현 |
|---|---|---|
| EXPORT_CARD | 캐릭터 카드 이미지 저장 | Canvas API → PNG 다운로드 |
| SHARE_RESULT | SNS 공유 | Web Share API / 클립보드 링크 복사 |
| RETRY_AUDIT | 퀴즈 다시 하기 | Zustand store 초기화 → 퀴즈 페이지 이동 |

### 반응형 전략

```
Mobile (< 768px):
┌──────────────┐
│ Top Bar      │
├──────────────┤
│ Character    │  ASCII + 이름 + 등급 + 설명
│ Card         │
├──────────────┤
│ Radar Chart  │  7각형, 전체 폭
├──────────────┤
│ Actionable   │  카테고리별 팁
│ Insights     │  (스크롤)
├──────────────┤
│ System Log   │  축소 3줄
├──────────────┤
│ Actions      │  버튼 3개 (세로 스택)
└──────────────┘

Desktop (>= 1024px):
┌──────────────────────────────────────┐
│ Top Bar                    [RETRY]   │
├──────────────────┬───────────────────┤
│ Character Card   │ Radar Chart (7축) │
├──────────────────┴───────────────────┤
│ Actionable Insights                  │
│ (카테고리별 팁 + 코드 스니펫)        │
├──────────────────────────────────────┤
│ System Log (축소)                    │
├──────────────────────────────────────┤
│ [EXPORT]    [SHARE]    [RETRY]       │
└──────────────────────────────────────┘
```

---

## 3. 컴포넌트 목록

| 컴포넌트 | 화면 | 역할 |
|---|---|---|
| `CrtOverlay` | 공통 | CRT scanline 효과 (CSS only) |
| `TopBar` | 공통 | 로고 + 진행률(퀴즈) / 로고 + 재시도(결과) |
| `StatusFooter` | 공통 | SYSTEM_LIVE 상태 표시 |
| `QuizTerminal` | 메인 | 시나리오 타이핑 + 선택지 |
| `OptionButtons` | 메인 | 3-4개 선택 버튼 |
| `TokenGauge` | 메인 | SVG 반원 게이지 + 바늘 애니메이션 |
| `SystemLog` | 공통 | 터미널 로그 피드 |
| `ProgressBar` | 메인 | 블록형 진행률 (N/7) |
| `CharacterCard` | 결과 | ASCII + 이름 + 등급 + 설명 + 강점/약점 |
| `RadarChart` | 결과 | 7축 레이더 (SVG) |
| `InsightPanel` | 결과 | 카테고리별 팁 + 코드 스니펫 + 복사 버튼 |
| `ActionBar` | 결과 | Export / Share / Retry 버튼 |

---

## 4. 캐릭터별 등급 매핑

| 캐릭터 | 등급 | Primary Color Accent |
|---|---|---|
| Token Alchemist | S-RANK | `#33FF33` (Green) |
| Prompt Architect | A-RANK | `#33FF33` (Green) |
| Brute Force Coder | B-RANK | `#FDAF00` (Amber) |
| Copy-Paste Gambler | B-RANK | `#FDAF00` (Amber) |
| Hopeful Beginner | C-RANK | `#FFB4AB` (Red) |

등급에 따라 Character Card의 배지 컬러와 glow 효과 색상이 변경된다.
