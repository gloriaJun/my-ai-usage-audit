import { Question } from "@/types";

export const questions: Question[] = [
  {
    id: "q1",
    category: "session",
    scenario:
      "Claude Code와 긴 대화를 나누다 보니 컨텍스트가 커져서 응답이 눈에 띄게 느려졌다. 어떻게 하겠는가?",
    options: [
      {
        text: "그냥 계속 대화를 이어간다",
        score: 0,
        tokenImpact: 0,
        logMessage:
          "SESSION_BLOAT: Context window at 98%... response latency +340ms... no action taken",
      },
      {
        text: "창을 닫고 새 세션을 시작한다",
        score: 1,
        tokenImpact: 2,
        logMessage:
          "SESSION_RESET: New session initialized... prior context lost... token usage cleared",
      },
      {
        text: "/compact 명령어로 대화를 요약한다",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "SESSION_OPTIMIZE: /compact executed... context compressed 73%... key context preserved",
      },
      {
        text: "/clear로 컨텍스트를 완전히 초기화한다",
        score: 2,
        tokenImpact: 2,
        logMessage:
          "SESSION_CLEAR: /clear executed... context wiped... fresh state restored",
      },
    ],
    insight:
      "/compact 명령어를 활용하면 중요한 컨텍스트를 유지하면서도 토큰 사용량을 줄일 수 있습니다. 대화가 길어질수록 /compact를 주기적으로 사용하는 습관을 들이세요.",
  },
  {
    id: "q2",
    category: "prompt",
    scenario:
      "새로운 기능을 구현하려 한다. Claude Code에 보내는 첫 메시지는?",
    options: [
      {
        text: '"로그인 기능 만들어줘"라고 간단히 요청한다',
        score: 0,
        tokenImpact: 0,
        logMessage:
          "PROMPT_VAGUE: Input parsed... ambiguity detected... clarification loop initiated",
      },
      {
        text: "요구사항 목록만 전달한다",
        score: 2,
        tokenImpact: 2,
        logMessage:
          "PROMPT_STRUCTURED: Requirements doc attached... parsing complete... context loaded",
      },
      {
        text: "CLAUDE.md 컨벤션 + 요구사항 + 예시 코드를 구조화해서 전달한다",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "PROMPT_OPTIMIZED: CLAUDE.md loaded + requirements parsed + examples indexed... ready for precision output",
      },
      {
        text: '비슷한 기존 코드를 복붙하며 "이거 수정해줘"라고 요청한다',
        score: 1,
        tokenImpact: 1,
        logMessage:
          "PROMPT_RAW_PASTE: Code blob received... context inference required... high token overhead",
      },
    ],
    insight:
      "CLAUDE.md에 프로젝트 컨벤션을 문서화하고, 요구사항과 예시 코드를 함께 제공하면 AI가 첫 시도에 정확한 코드를 생성할 가능성이 크게 높아집니다.",
  },
  {
    id: "q3",
    category: "error",
    scenario: "AI가 같은 에러를 3번째 반복하고 있다. 어떻게 하겠는가?",
    options: [
      {
        text: '계속 "고쳐줘"를 반복한다',
        score: 0,
        tokenImpact: 0,
        logMessage:
          "ERROR_LOOP: Same fix attempted x3... no progress detected... infinite retry pattern",
      },
      {
        text: "에러 로그를 복붙하며 다시 요청한다",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "ERROR_LOG_DUMP: Stack trace attached... root cause analysis pending... partial context",
      },
      {
        text: "직접 에러를 분석한 후 맥락과 함께 새로운 접근 방법을 요청한다",
        score: 3,
        tokenImpact: 2,
        logMessage:
          "ERROR_DIAGNOSED: Root cause identified... new approach vector specified... context enriched",
      },
      {
        text: "/clear 후 에러 상황만 정리해서 새로 시작한다",
        score: 2,
        tokenImpact: 3,
        logMessage:
          "ERROR_RESET: /clear executed... error context distilled... clean slate approach initiated",
      },
    ],
    insight:
      "같은 에러가 반복될 때는 AI에게 계속 요청하기보다 직접 에러를 분석하고 근본 원인을 파악해야 합니다. 컨텍스트를 리셋하고 핵심 정보만 담아 새로 시작하는 것이 효율적입니다.",
  },
  {
    id: "q4",
    category: "code-review",
    scenario:
      "AI가 생성한 200줄 코드가 정상 동작한다. 다음 행동은?",
    options: [
      {
        text: "바로 커밋한다",
        score: 0,
        tokenImpact: 1,
        logMessage:
          "COMMIT_BLIND: 200 LOC committed without review... risk level: HIGH... no test coverage",
      },
      {
        text: "전체 코드를 훑어보고 커밋한다",
        score: 1,
        tokenImpact: 2,
        logMessage:
          "REVIEW_SURFACE: Quick scan complete... logic unverified... commit queued",
      },
      {
        text: "git diff로 변경사항을 리뷰하고 테스트를 작성한 후 커밋한다",
        score: 3,
        tokenImpact: 2,
        logMessage:
          "REVIEW_THOROUGH: git diff analyzed... unit tests written... coverage verified... safe to commit",
      },
      {
        text: 'AI에게 "코드 리뷰해줘"라고 요청한다',
        score: 2,
        tokenImpact: 1,
        logMessage:
          "REVIEW_DELEGATED: AI self-review requested... bias risk present... partial validation",
      },
    ],
    insight:
      "AI 생성 코드도 반드시 직접 리뷰해야 합니다. `git diff`로 변경사항을 확인하고, 핵심 로직에 대한 테스트를 작성하는 습관이 버그를 사전에 방지합니다.",
  },
  {
    id: "q5",
    category: "memory",
    scenario:
      "프로젝트 컨벤션(네이밍, 폴더 구조 등)을 매번 설명하고 있다. 어떻게 개선하겠는가?",
    options: [
      {
        text: "어쩔 수 없다고 생각하고 계속 반복한다",
        score: 0,
        tokenImpact: 0,
        logMessage:
          "MEMORY_NONE: Convention context re-transmitted... token waste: ~2000/session... no solution",
      },
      {
        text: "자주 쓰는 프롬프트를 메모장에 저장해 복붙한다",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "MEMORY_MANUAL: Prompt snippet loaded from notepad... manual process... marginal improvement",
      },
      {
        text: "CLAUDE.md에 컨벤션을 문서화해둔다",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "MEMORY_PERSISTENT: CLAUDE.md loaded... conventions auto-injected... zero overhead per session",
      },
      {
        text: "이전 대화를 참고하라고 지시한다",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "MEMORY_REFERENCE: Prior session lookup requested... context availability: uncertain",
      },
    ],
    insight:
      "CLAUDE.md 파일에 프로젝트 컨벤션, 기술 스택, 폴더 구조를 문서화해두면 매 세션마다 자동으로 컨텍스트가 로드됩니다. 한 번의 투자로 모든 세션의 품질을 높일 수 있습니다.",
  },
  {
    id: "q6",
    category: "tool",
    scenario: "여러 파일을 동시에 수정해야 한다. 어떤 접근을 취하겠는가?",
    options: [
      {
        text: "파일 하나씩 수정 요청한다",
        score: 0,
        tokenImpact: 0,
        logMessage:
          "TOOL_SEQUENTIAL: Single-file edit mode... 7 requests queued... estimated time: 14min",
      },
      {
        text: "한 번에 모든 파일 수정을 요청한다",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "TOOL_BULK_REQUEST: Multi-file prompt sent... context overload risk... partial edits likely",
      },
      {
        text: "Agent 모드를 활용해 병렬 수정을 지시한다",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "TOOL_AGENT: Agent mode activated... parallel edit tasks spawned... all files updated simultaneously",
      },
      {
        text: "직접 수정하고 AI에게 검증을 요청한다",
        score: 2,
        tokenImpact: 2,
        logMessage:
          "TOOL_MANUAL_VERIFY: Manual edits applied... AI validation requested... diff review complete",
      },
    ],
    insight:
      "Claude Code의 Agent 모드를 사용하면 여러 파일을 병렬로 수정할 수 있습니다. 복잡한 리팩토링이나 다중 파일 변경 시 Agent 모드를 적극 활용하세요.",
  },
  {
    id: "q7",
    category: "workflow",
    scenario: "대규모 리팩토링을 해야 한다. 어떻게 시작하겠는가?",
    options: [
      {
        text: '"전체 리팩토링 해줘"라고 한 번에 지시한다',
        score: 0,
        tokenImpact: 0,
        logMessage:
          "WORKFLOW_CHAOS: Full refactor requested without scope... token explosion risk... unpredictable output",
      },
      {
        text: "파일별로 하나씩 수정 요청한다",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "WORKFLOW_INCREMENTAL: File-by-file mode... no plan document... risk of inconsistency",
      },
      {
        text: "Plan 모드로 분석 후 단계별로 실행한다",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "WORKFLOW_PLANNED: Plan mode engaged... dependency graph built... staged execution initiated",
      },
      {
        text: 'TODO 리스트 만들어달라고 한 뒤 하나씩 진행한다',
        score: 2,
        tokenImpact: 2,
        logMessage:
          "WORKFLOW_TODO: Task list generated... sequential execution started... progress tracked",
      },
    ],
    insight:
      "대규모 변경 전에 Plan 모드를 활용해 전체 범위를 분석하고 의존성을 파악하세요. 단계별 실행 계획을 세우면 실수를 줄이고 진행 상황을 명확하게 관리할 수 있습니다.",
  },
];
