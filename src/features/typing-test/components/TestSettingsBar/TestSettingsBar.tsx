import Dropdown from "@/src/shared/components/Dropdown/Dropdown";
import { TestDifficulty, TestDuration } from "../../model/types";
import Selector from "@/src/shared/components/Selector/Selector";

interface TestSettingsBarProps {
  difficulty: TestDifficulty;
  duration: TestDuration;
  onDifficultyChange: (value: TestDifficulty) => void;
  onDurationChange: (value: TestDuration) => void;
}

const TestSettingsBar = ({
  difficulty,
  duration,
  onDifficultyChange,
  onDurationChange,
}: TestSettingsBarProps) => {
  const difficultyMode = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
  ];

  const durationMode = [
    { label: "Timed (60s)", value: 60 },
    { label: "Passage", value: 0 },
  ];
  return (
    <section aria-label="Test settings">
      <div className="flex items-center gap-x-10 md:hidden">
        <Dropdown
          options={difficultyMode}
          value={difficulty}
          onChange={(val) => onDifficultyChange(val as TestDifficulty)}
        />
        <Dropdown
          options={durationMode}
          value={duration}
          onChange={(val) => onDurationChange(Number(val) as TestDuration)}
          className=""
        />
      </div>

      <div className="hidden md:flex md:items-center md:space-x-16">
        <Selector
          id="difficulty-label"
          label="Difficulty"
          options={difficultyMode}
          value={difficulty}
          onChange={(val) => onDifficultyChange(val as TestDifficulty)}
          className="hidden md:flex"
        />

        <div
          aria-hidden="true"
          className="min-w-px bg-neutral-700 self-stretch shrink-0"
        ></div>

        <Selector
          id="duration-label"
          label="Mode"
          options={durationMode}
          value={duration}
          onChange={(val) => onDurationChange(Number(val) as TestDuration)}
          className="hidden md:flex"
        />
      </div>
    </section>
  );
};

export default TestSettingsBar;
