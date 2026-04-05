import { Character, CategoryTip } from "@/types";

export const characters: Character[] = [
  {
    id: "token-alchemist",
    name: "Token Alchemist",
    rank: "S",
    description: "토큰을 황금으로 바꾸는 AI 활용의 연금술사",
    colorAccent: "#33FF33",
    asciiArt: `
  ╔═══════════════════╗
  ║  ◈ TOKEN MASTER ◈ ║
  ╠═══════════════════╣
  ║    (◉‿◉)✨        ║
  ║   /|   |\\         ║
  ║  / |   | \\        ║
  ║ ~~~~~~~~~~~       ║
  ║  ⚗ [S RANK] ⚗    ║
  ║  EFFICIENCY: MAX  ║
  ║  SKILL: PERFECT   ║
  ╚═══════════════════╝`,
    condition: {
      skillMin: 15,
      skillMax: 21,
      efficiencyMin: 15,
      efficiencyMax: 21,
    },
  },
  {
    id: "prompt-architect",
    name: "Prompt Architect",
    rank: "A",
    description: "정밀한 프롬프트로 AI를 설계하는 구조주의자",
    colorAccent: "#33FF33",
    asciiArt: `
  ╔═══════════════════╗
  ║  ◈ ARCHITECT ◈   ║
  ╠═══════════════════╣
  ║    (•̀ᴗ•́)📐       ║
  ║   /|   |\\         ║
  ║  / |   | \\        ║
  ║ ~~~~~~~~~~~       ║
  ║  🏗 [A RANK] 🏗    ║
  ║  SKILL: HIGH      ║
  ║  PRECISION: +++   ║
  ╚═══════════════════╝`,
    condition: {
      skillMin: 15,
      skillMax: 21,
      efficiencyMin: 8,
      efficiencyMax: 14,
    },
  },
  {
    id: "copy-paste-gambler",
    name: "Copy-Paste Gambler",
    rank: "B",
    description: "운에 맡기는 복붙의 도박사, 가끔은 통한다",
    colorAccent: "#FDAF00",
    asciiArt: `
  ╔═══════════════════╗
  ║  ◈  GAMBLER  ◈   ║
  ╠═══════════════════╣
  ║    (¯▿¯)🎲        ║
  ║   /|   |\\         ║
  ║  / |   | \\        ║
  ║ ~~~~~~~~~~~       ║
  ║  🃏 [B RANK] 🃏   ║
  ║  LUCK: HIGH       ║
  ║  SKILL: LOW       ║
  ╚═══════════════════╝`,
    condition: {
      skillMin: 0,
      skillMax: 10,
      efficiencyMin: 15,
      efficiencyMax: 21,
    },
  },
  {
    id: "brute-force-coder",
    name: "Brute Force Coder",
    rank: "B",
    description: "무한 재시도로 결국 해결하는 집념의 개발자",
    colorAccent: "#FDAF00",
    asciiArt: `
  ╔═══════════════════╗
  ║  ◈ BRUTE FORCE ◈ ║
  ╠═══════════════════╣
  ║    (ಠ_ಠ)💪        ║
  ║   /|   |\\         ║
  ║  / |   | \\        ║
  ║ ~~~~~~~~~~~       ║
  ║  🔨 [B RANK] 🔨   ║
  ║  PERSISTENCE: MAX ║
  ║  EFFICIENCY: LOW  ║
  ╚═══════════════════╝`,
    condition: {
      skillMin: 8,
      skillMax: 14,
      efficiencyMin: 0,
      efficiencyMax: 10,
    },
  },
  {
    id: "hopeful-beginner",
    name: "Hopeful Beginner",
    rank: "C",
    description: "AI의 가능성을 믿으며 성장 중인 기대주",
    colorAccent: "#FFB4AB",
    asciiArt: `
  ╔═══════════════════╗
  ║  ◈  BEGINNER  ◈  ║
  ╠═══════════════════╣
  ║    (≧▽≦)🌱        ║
  ║   /|   |\\         ║
  ║  / |   | \\        ║
  ║ ~~~~~~~~~~~       ║
  ║  🌟 [C RANK] 🌟   ║
  ║  POTENTIAL: HIGH  ║
  ║  XP: ACCUMULATING ║
  ╚═══════════════════╝`,
    condition: {
      skillMin: 0,
      skillMax: 14,
      efficiencyMin: 0,
      efficiencyMax: 14,
    },
  },
];

export const categoryTips: Record<string, CategoryTip> = {
  session: {
    category: "session",
    categoryLabel: "세션 관리",
    guide:
      "컨텍스트가 커질수록 응답 품질이 저하됩니다. /compact 명령어로 핵심 맥락을 유지하면서 토큰을 압축하거나, 새로운 작업 단위마다 /clear로 깨끗하게 시작하세요. 장시간 작업 시 30분마다 /compact를 실행하는 습관을 들이면 좋습니다.",
    snippet: "/compact\n# 또는 새 작업 시작 시\n/clear",
  },
  prompt: {
    category: "prompt",
    categoryLabel: "프롬프트 작성",
    guide:
      "구조화된 프롬프트는 AI의 첫 번째 응답 품질을 크게 높입니다. 요구사항, 제약 조건, 예시를 명확히 분리해서 전달하세요. CLAUDE.md에 반복되는 컨텍스트를 저장해두면 매번 설명할 필요가 없습니다.",
    snippet: `## 요청사항\n[구현할 기능 설명]\n\n## 제약 조건\n- 기술 스택: [스택 명시]\n- 컨벤션: CLAUDE.md 참고\n\n## 예시\n[참고할 코드나 패턴]`,
  },
  error: {
    category: "error",
    categoryLabel: "에러 디버깅",
    guide:
      "같은 에러가 반복될 때는 AI에게 계속 요청하기보다 직접 에러 메시지와 스택 트레이스를 분석하세요. 근본 원인을 파악한 뒤, 새로운 접근 방법과 함께 /clear로 컨텍스트를 리셋하고 다시 시작하면 효과적입니다.",
    snippet: "# 에러 반복 시 접근법\n1. 에러 메시지 직접 분석\n2. /clear 실행\n3. 에러 원인 + 시도한 방법 + 새 접근 요청",
  },
  "code-review": {
    category: "code-review",
    categoryLabel: "코드 리뷰",
    guide:
      "AI가 생성한 코드도 반드시 직접 검토해야 합니다. git diff로 변경사항을 파악하고, 비즈니스 로직의 정확성을 확인하세요. 핵심 함수에 대한 단위 테스트를 작성하면 이후 리팩토링 시에도 안전망이 됩니다.",
    snippet: "git diff HEAD\ngit diff --staged\n# 변경된 파일 확인 후 테스트 작성",
  },
  memory: {
    category: "memory",
    categoryLabel: "프로젝트 메모리",
    guide:
      "CLAUDE.md 파일에 프로젝트의 핵심 정보를 문서화하면 매 세션마다 자동으로 컨텍스트가 주입됩니다. 네이밍 컨벤션, 폴더 구조, 기술 스택, 금지 패턴 등을 명시해두세요.",
    snippet: `# CLAUDE.md 템플릿\n## 기술 스택\n- 프레임워크: Next.js 14 (App Router)\n- 언어: TypeScript\n\n## 네이밍 컨벤션\n- 컴포넌트: PascalCase\n- 함수: camelCase\n- 상수: UPPER_SNAKE_CASE\n\n## 폴더 구조\nsrc/\n  app/     # 라우팅\n  components/  # UI 컴포넌트\n  lib/     # 유틸리티`,
  },
  tool: {
    category: "tool",
    categoryLabel: "도구 활용",
    guide:
      "Claude Code의 Agent 모드는 여러 파일을 병렬로 수정할 수 있는 강력한 기능입니다. 단순 반복 작업이나 다중 파일 수정 시 Agent를 활용하면 시간을 크게 절약할 수 있습니다. MultiEdit 기능도 함께 활용하세요.",
    snippet: "# Agent 모드 활용\n> 다음 파일들을 동시에 수정해줘:\n> - src/components/Button.tsx\n> - src/components/Input.tsx\n> - src/styles/theme.ts\n> [변경 사항 설명]",
  },
  workflow: {
    category: "workflow",
    categoryLabel: "작업 흐름",
    guide:
      "대규모 변경 전에 Plan 모드로 전체 범위를 분석하고 의존성을 파악하세요. 단계별 실행 계획을 수립한 후 각 단계를 검증하면서 진행하면 예기치 않은 버그를 방지할 수 있습니다.",
    snippet: "# Plan 모드 워크플로\n1. Plan 모드로 분석 요청\n   > 이 리팩토링의 영향 범위와 단계별 계획을 세워줘\n2. 계획 검토 및 승인\n3. 단계별 실행 + 각 단계 후 테스트\n4. 전체 통합 테스트",
  },
};
