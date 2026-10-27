import { Fragment } from "react/jsx-runtime";

interface TestStatsProps {
  wpm: number;
  accuracy: number;
  timeRemaining: number;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

const TestStats = ({ wpm, accuracy, timeRemaining }: TestStatsProps) => {
  const stats = [
    {
      label: "WPM",
      value: String(wpm),
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
    },
    {
      label: "Time",
      value: formatTime(timeRemaining),
    },
  ];

  return (
    <section className="" aria-label="Typing statistics">
      <dl className="flex items-center gap-x-20 md:gap-x-24">
        {stats.map((item, index) => (
          <Fragment key={item.label}>
            <div className="grow flex flex-col items-center gap-y-8 md:flex-row md:gap-x-12 md:grow-0">
              <dt className="text-neutral-400 md:text-20">{item.label}:</dt>
              <dd
                className={`font-bold text-24 leading-100  ${item.label === "Accuracy" ? "text-red-500" : item.label === "Time" ? "text-yellow-400" : "text-white"}`}
              >
                {item.value}
              </dd>
            </div>

            {index < stats.length - 1 && (
              <div
                aria-hidden="true"
                className="min-w-px bg-neutral-700 self-stretch shrink-0"
              ></div>
            )}
          </Fragment>
        ))}
      </dl>
    </section>
  );
};

export default TestStats;
