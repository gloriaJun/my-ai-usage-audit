import { Question } from "@/types";

export const questionsEn: Question[] = [
  {
    id: "q1",
    category: "session",
    scenario:
      "After a long conversation in Claude Code, the context has grown and responses are slowing down. You still need the current working context. What do you do?",
    options: [
      {
        text: "Keep chatting without any change",
        score: 0,
        tokenImpact: 0,
        logMessage:
          "SESSION_BLOAT: Context window at 98%... response latency +340ms... no action taken",
      },
      {
        text: "Close the window and start a brand-new session",
        score: 1,
        tokenImpact: 2,
        logMessage:
          "SESSION_RESET: New session initialized... prior context lost... token usage cleared",
      },
      {
        text: "Since current context matters, summarize with /compact",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "SESSION_OPTIMIZE: /compact executed... context compressed 73%... key context preserved",
      },
      {
        text: "If this is a new task, reset everything with /clear",
        score: 2,
        tokenImpact: 2,
        logMessage:
          "SESSION_CLEAR: /clear executed... context wiped... fresh state restored",
      },
    ],
    insight:
      "Use a simple rule: /compact when continuing the same task, /clear when switching to a completely different task. Use /compact regularly in long sessions.",
  },
  {
    id: "q2",
    category: "prompt",
    scenario: "You are about to implement a new feature. What should your first message to Claude Code look like?",
    options: [
      {
        text: 'Send a short request like "build login"',
        score: 0,
        tokenImpact: 0,
        logMessage:
          "PROMPT_VAGUE: Input parsed... ambiguity detected... clarification loop initiated",
      },
      {
        text: "Share only a list of requirements",
        score: 2,
        tokenImpact: 2,
        logMessage:
          "PROMPT_STRUCTURED: Requirements doc attached... parsing complete... context loaded",
      },
      {
        text: "Provide CLAUDE.md conventions + requirements + example code in a structured format",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "PROMPT_OPTIMIZED: CLAUDE.md loaded + requirements parsed + examples indexed... ready for precision output",
      },
      {
        text: 'Paste similar existing code and ask "modify this"',
        score: 1,
        tokenImpact: 1,
        logMessage:
          "PROMPT_RAW_PASTE: Code blob received... context inference required... high token overhead",
      },
    ],
    insight:
      "If you document project conventions in CLAUDE.md and provide requirements with examples, AI is much more likely to produce accurate code on the first attempt.",
  },
  {
    id: "q3",
    category: "error",
    scenario: "AI has repeated the same error three times. What do you do next?",
    options: [
      {
        text: 'Keep saying "fix it" repeatedly',
        score: 0,
        tokenImpact: 0,
        logMessage:
          "ERROR_LOOP: Same fix attempted x3... no progress detected... infinite retry pattern",
      },
      {
        text: "Paste the same error logs and ask again",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "ERROR_LOG_DUMP: Stack trace attached... root cause analysis pending... partial context",
      },
      {
        text: "Analyze the error yourself, then request a new approach with that context",
        score: 3,
        tokenImpact: 2,
        logMessage:
          "ERROR_DIAGNOSED: Root cause identified... new approach vector specified... context enriched",
      },
      {
        text: "Run /clear and restart with only the essential error context",
        score: 2,
        tokenImpact: 3,
        logMessage:
          "ERROR_RESET: /clear executed... error context distilled... clean slate approach initiated",
      },
    ],
    insight:
      "When the same error repeats, stop retrying blindly. Identify the root cause first, then restart with concise, high-signal context.",
  },
  {
    id: "q4",
    category: "code-review",
    scenario: "AI generated 200 lines of code and it seems to work. What should you do next?",
    options: [
      {
        text: "Commit immediately",
        score: 0,
        tokenImpact: 1,
        logMessage:
          "COMMIT_BLIND: 200 LOC committed without review... risk level: HIGH... no test coverage",
      },
      {
        text: "Quickly skim the code, then commit",
        score: 1,
        tokenImpact: 2,
        logMessage:
          "REVIEW_SURFACE: Quick scan complete... logic unverified... commit queued",
      },
      {
        text: "Review with git diff, add tests, then commit",
        score: 3,
        tokenImpact: 2,
        logMessage:
          "REVIEW_THOROUGH: git diff analyzed... unit tests written... coverage verified... safe to commit",
      },
      {
        text: 'Ask AI to "review its own code"',
        score: 2,
        tokenImpact: 1,
        logMessage:
          "REVIEW_DELEGATED: AI self-review requested... bias risk present... partial validation",
      },
    ],
    insight:
      "Always review AI-generated code yourself. Use `git diff` and tests on critical logic to prevent regressions.",
  },
  {
    id: "q5",
    category: "memory",
    scenario:
      "You keep re-explaining project conventions (naming, folder structure, etc.). How would you improve this?",
    options: [
      {
        text: "Accept it and keep repeating the context",
        score: 0,
        tokenImpact: 0,
        logMessage:
          "MEMORY_NONE: Convention context re-transmitted... token waste: ~2000/session... no solution",
      },
      {
        text: "Save common prompts in a note and copy-paste",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "MEMORY_MANUAL: Prompt snippet loaded from notepad... manual process... marginal improvement",
      },
      {
        text: "Document conventions in CLAUDE.md",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "MEMORY_PERSISTENT: CLAUDE.md loaded... conventions auto-injected... zero overhead per session",
      },
      {
        text: "Tell AI to refer to previous conversations",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "MEMORY_REFERENCE: Prior session lookup requested... context availability: uncertain",
      },
    ],
    insight:
      "A solid CLAUDE.md lets your conventions load automatically every session. One-time setup improves every future interaction.",
  },
  {
    id: "q6",
    category: "tool",
    scenario: "You need to modify multiple files at once. What approach do you take?",
    options: [
      {
        text: "Request edits one file at a time",
        score: 0,
        tokenImpact: 0,
        logMessage:
          "TOOL_SEQUENTIAL: Single-file edit mode... 7 requests queued... estimated time: 14min",
      },
      {
        text: "Ask for all file changes in one huge prompt",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "TOOL_BULK_REQUEST: Multi-file prompt sent... context overload risk... partial edits likely",
      },
      {
        text: "Use Agent mode for parallel edits",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "TOOL_AGENT: Agent mode activated... parallel edit tasks spawned... all files updated simultaneously",
      },
      {
        text: "Edit manually first, then ask AI to validate",
        score: 2,
        tokenImpact: 2,
        logMessage:
          "TOOL_MANUAL_VERIFY: Manual edits applied... AI validation requested... diff review complete",
      },
    ],
    insight:
      "Agent mode in Claude Code is effective for parallel multi-file changes. Use it proactively for larger refactors.",
  },
  {
    id: "q7",
    category: "workflow",
    scenario: "You need a large-scale refactor. How do you start?",
    options: [
      {
        text: 'Say "refactor everything" in one go',
        score: 0,
        tokenImpact: 0,
        logMessage:
          "WORKFLOW_CHAOS: Full refactor requested without scope... token explosion risk... unpredictable output",
      },
      {
        text: "Request changes file by file",
        score: 1,
        tokenImpact: 1,
        logMessage:
          "WORKFLOW_INCREMENTAL: File-by-file mode... no plan document... risk of inconsistency",
      },
      {
        text: "Use Plan mode to analyze first, then execute in stages",
        score: 3,
        tokenImpact: 3,
        logMessage:
          "WORKFLOW_PLANNED: Plan mode engaged... dependency graph built... staged execution initiated",
      },
      {
        text: "Ask for a TODO list and execute one by one",
        score: 2,
        tokenImpact: 2,
        logMessage:
          "WORKFLOW_TODO: Task list generated... sequential execution started... progress tracked",
      },
    ],
    insight:
      "Before major changes, map scope and dependencies with Plan mode. A staged plan reduces mistakes and keeps progress visible.",
  },
];
