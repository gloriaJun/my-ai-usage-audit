# User Flow: My AI Usage Audit

## 1. 전체 사용자 여정

사용자가 서비스에 진입하여 결과를 공유하기까지의 전체 플로우.

```mermaid
journey
    title My AI Usage Audit - 사용자 여정
    section Landing
      서비스 진입: 5: 사용자
      터미널 부팅 애니메이션 감상: 4: 사용자
      AUDIT 시작 버튼 클릭: 5: 사용자
    section Quiz (7 Steps)
      시나리오 읽기: 4: 사용자
      선택지 고르기: 5: 사용자
      Token Gauge 변화 확인: 3: 사용자
      System Log 피드백 확인: 3: 사용자
      다음 스텝 진행 (x7): 4: 사용자
    section Result
      캐릭터 확인: 5: 사용자
      강점/약점 분석 확인: 4: 사용자
      카테고리별 맞춤 팁 확인: 4: 사용자
    section Share
      캐릭터 카드 이미지 저장: 3: 사용자
      SNS 공유: 3: 사용자
```

### 메인 플로우

```mermaid
flowchart LR
    A[Landing Page] -->|START AUDIT| B[Quiz Step 1/7]
    B --> C[Quiz Step 2/7]
    C --> D[Quiz Step 3/7]
    D --> E[Quiz Step 4/7]
    E --> F[Quiz Step 5/7]
    F --> G[Quiz Step 6/7]
    G --> H[Quiz Step 7/7]
    H -->|점수 산출| I[Result Page]
    I -->|공유하기| J[Share Flow]
    I -->|다시 하기| A
```

## 2. 퀴즈 진행 상세 플로우

각 스텝에서 사용자 선택 → UI 피드백 → 상태 업데이트가 이루어지는 과정.

```mermaid
flowchart TD
    START([스텝 시작]) --> RENDER[시나리오 렌더링<br/>타이핑 애니메이션]
    RENDER --> DISPLAY[선택지 4개 표시]
    DISPLAY --> SELECT{사용자 선택}
    SELECT --> SCORE[score + tokenImpact 누적<br/>Zustand Store 업데이트]
    SCORE --> GAUGE[Token Gauge 애니메이션<br/>바늘 이동]
    SCORE --> LOG[System Log에<br/>logMessage 추가]
    SCORE --> PROGRESS[Progress Bar 업데이트<br/>N/7]
    GAUGE --> CHECK{마지막 스텝?}
    LOG --> CHECK
    PROGRESS --> CHECK
    CHECK -->|아니오| NEXT[다음 스텝 전환<br/>터미널 전환 애니메이션]
    NEXT --> RENDER
    CHECK -->|예| RESULT([결과 페이지로 이동])
```

### 컴포넌트 간 상호작용

```mermaid
sequenceDiagram
    participant U as 사용자
    participant QB as QuizTerminal
    participant ZS as Zustand Store
    participant TG as Token Gauge
    participant SL as System Log
    participant PB as Progress Bar

    U->>QB: 선택지 클릭
    QB->>ZS: updateAnswer(stepId, option)
    ZS->>ZS: score += option.score
    ZS->>ZS: tokenImpact += option.tokenImpact
    ZS-->>TG: tokenImpact 값 전달
    TG->>TG: 바늘 애니메이션 (Framer Motion)
    ZS-->>SL: option.logMessage 전달
    SL->>SL: 로그 항목 추가 + auto-scroll
    ZS-->>PB: currentStep 전달
    PB->>PB: 진행률 업데이트
    ZS-->>QB: 다음 스텝 로드
    QB->>QB: 타이핑 애니메이션으로 시나리오 표시
```

## 3. 결과 산출 로직

7문항 완료 후 캐릭터를 결정하고 맞춤 팁을 생성하는 과정.

```mermaid
flowchart TD
    DONE([7문항 완료]) --> SUM[점수 합산]
    SUM --> SKILL[실력 점수 = sum of score]
    SUM --> TOKEN[효율 점수 = sum of tokenImpact]

    SKILL --> MATRIX{2축 매트릭스 매핑}
    TOKEN --> MATRIX

    MATRIX -->|실력 높 + 효율 높| A["Token Alchemist<br/>최소 토큰으로 최대 결과"]
    MATRIX -->|실력 높 + 효율 보통| B["Prompt Architect<br/>잘 쓰지만 최적화 여지"]
    MATRIX -->|실력 보통 + 효율 낮| C["Brute Force Coder<br/>결과는 내지만 토큰 불태움"]
    MATRIX -->|실력 낮 + 효율 낮| D["Hopeful Beginner<br/>가능성 무한한 입문자"]
    MATRIX -->|실력 낮 + 효율 높| E["Copy-Paste Gambler<br/>검증 없이 빠르게 복붙"]

    A --> ANALYZE
    B --> ANALYZE
    C --> ANALYZE
    D --> ANALYZE
    E --> ANALYZE

    ANALYZE[카테고리별 약점 분석] --> TIP[맞춤 팁 생성]
    TIP --> RENDER_RESULT[결과 페이지 렌더링]
```

### 카테고리별 진단 매핑

```mermaid
flowchart LR
    subgraph 7개 카테고리
        Q1[1. Session 관리]
        Q2[2. 프롬프트 품질]
        Q3[3. 에러 대응]
        Q4[4. 코드 검증]
        Q5[5. 메모리 활용]
        Q6[6. 도구 활용]
        Q7[7. 워크플로우 설계]
    end

    subgraph 약점 판별
        Q1 -->|score < threshold| T1["/compact, /clear 사용법 안내"]
        Q2 -->|score < threshold| T2["요구사항 구조화 템플릿 제공"]
        Q3 -->|score < threshold| T3["Interrupt → 맥락 리셋 가이드"]
        Q4 -->|score < threshold| T4["diff 리뷰 및 테스트 체크리스트"]
        Q5 -->|score < threshold| T5["CLAUDE.md 템플릿 제공"]
        Q6 -->|score < threshold| T6["Agent, multi-edit 활용 가이드"]
        Q7 -->|score < threshold| T7["Plan 모드 워크플로우 스니펫"]
    end
```

## 4. 화면 상태 다이어그램

```mermaid
stateDiagram-v2
    [*] --> Landing

    Landing --> Quiz : START AUDIT 클릭

    state Quiz {
        [*] --> Step1
        Step1 --> Step2 : 선택 완료
        Step2 --> Step3 : 선택 완료
        Step3 --> Step4 : 선택 완료
        Step4 --> Step5 : 선택 완료
        Step5 --> Step6 : 선택 완료
        Step6 --> Step7 : 선택 완료
        Step7 --> [*] : 7문항 완료
    }

    Quiz --> Calculating : 전체 완료
    Calculating --> Result : 캐릭터 결정

    state Result {
        [*] --> CharacterCard
        CharacterCard --> StrengthWeakness
        StrengthWeakness --> ActionableTips
        ActionableTips --> ShareOptions
    }

    Result --> ShareFlow : 공유 버튼 클릭
    Result --> Landing : 다시 하기

    state ShareFlow {
        [*] --> GenerateImage : Canvas API로 카드 생성
        GenerateImage --> SaveImage : 이미지 저장
        GenerateImage --> SNSShare : SNS 공유
    }

    ShareFlow --> Result : 돌아가기
```

## 5. UI 컴포넌트 매핑

Stitch 디자인 요소와 사용자 플로우의 연결 관계.

| Stitch 디자인 요소 | 컴포넌트 | 플로우 역할 | 데이터 소스 |
|---|---|---|---|
| Terminal Window (메인 영역) | `QuizTerminal` | 시나리오 + 선택지 표시 | `questions.json` → Zustand |
| Token Leakage Monitor (게이지) | `TokenGauge` | tokenImpact 실시간 시각화 | Zustand `tokenImpact` |
| System Event Log | `SystemLog` | 선택 결과 피드백 로그 | Zustand `logMessages[]` |
| Progress Bar (블록형) | `ProgressBar` | 퀴즈 진행률 (N/7) | Zustand `currentStep` |
| Data Stream (바이너리) | `DataStream` | 분위기 연출 (장식) | 정적 |
| CRT Overlay | `CrtOverlay` | 레트로 터미널 분위기 | CSS only |
| Top Bar (STEP 01/07) | `TopBar` | 현재 단계 표시 | Zustand `currentStep` |
| Footer (SYSTEM_LIVE) | `StatusBar` | 시스템 상태 연출 | 정적 + 타이머 |

### Zustand Store 구조

```mermaid
flowchart TD
    subgraph ZustandStore[Zustand Quiz Store]
        CS[currentStep: number]
        ANS[answers: Map]
        SC[totalScore: number]
        TI[totalTokenImpact: number]
        LOGS[logMessages: string array]
        CHAR[character: string | null]
    end

    subgraph Components
        QT[QuizTerminal]
        TG[TokenGauge]
        SL[SystemLog]
        PB[ProgressBar]
        RP[ResultPage]
    end

    CS --> QT
    CS --> PB
    TI --> TG
    LOGS --> SL
    SC --> RP
    TI --> RP
    CHAR --> RP
```
