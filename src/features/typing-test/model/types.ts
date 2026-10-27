export type TestStatus = "idle" | "running" | "completed";

export type TestMode = "timed" | "passage";

export type TestDifficulty = "easy" | "medium" | "hard";

export type TestDuration = 60 | 0;

export type CompletionType = "first-completion" | "new-best" | "completed";

export interface TestSettings {
  mode: TestMode;
  difficulty: TestDifficulty;
  duration: TestDuration;
}

export interface TypingSession {
  status: TestStatus;
  text: string;
  userInput: string;
  elapsedSeconds: number;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  correctCharacters: number;
  incorrectCharacter: number;
}
