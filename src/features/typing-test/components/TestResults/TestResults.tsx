"use client";

import Image from "next/image";
import { CompletionType } from "../../model/types";
import { motion } from "framer-motion";

interface TestResultsProps {
  wpm: number;
  accuracy: number;
  correctChar: number;
  incorrectChar: number;
  onRestart: () => void;
  completionType: CompletionType;
}

const RESULT_CONTENT: Record<
  CompletionType,
  { title: string; description: string; icon: string; textButton: string }
> = {
  "first-completion": {
    title: "Baseline Established!",
    description:
      "You've set the bar. Now the real challenge begins—time to beat it.",
    icon: "/images/icon-completed.svg",
    textButton: "Beat This Score",
  },
  "new-best": {
    title: "New personal best!",
    description: "You're getting faster. That was incredible typing.",
    icon: "/images/icon-new-pb.svg",
    textButton: "Beat This Score",
  },
  completed: {
    title: "Test complete!",
    description: "Solid run. Keep pushing to beat your high score.",
    icon: "/images/icon-completed.svg",
    textButton: "Go Again",
  },
};

const TestResults = ({
  wpm,
  accuracy,
  correctChar,
  incorrectChar,
  completionType,
  onRestart,
}: TestResultsProps) => {
  const content = RESULT_CONTENT[completionType];
  const animation = {
    initial: { opacity: 0, translateY: 10 },
    animate: { opacity: 1, translateY: 0 },
  };
  return (
    <section
      aria-labelledby="test-results-title"
      className="relative flex flex-col items-center gap-y-24 mt-32 md:gap-y-32 md:mt-80"
    >
      <motion.div aria-hidden="true" {...animation}>
        <Image
          src={content.icon}
          alt=""
          width="64"
          height="64"
          className={`h-auto md:w-auto ${completionType !== "new-best" ? "w-48 rounded-full ring-10 ring-green-500/20 outline-20 outline-green-500/10 md:w-auto md:ring-16 md:outline-32" : "w-64 md:w-80"}`}
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-y-10 text-center mt-16 md:mt-24"
        {...animation}
        transition={{ delay: 0.3 }}
      >
        <h2
          id="text-results-title"
          className="font-bold text-24 leading-120 tracking-032 text-white md:text-40"
        >
          {content.title}
        </h2>
        <p className="leading-120 -tracking-048 text-neutral-400 md:text-20">
          {content.description}
        </p>
      </motion.div>

      <dl className="w-full flex flex-col gap-y-16 pb-16 md:grid md:grid-cols-3 md:gap-x-20 md:pt-20 md:pb-32 lg:flex lg:flex-row lg:justify-center">
        <motion.div
          className="px-24 py-16 border border-neutral-700 rounded-8 flex flex-col gap-y-12 lg:w-[10rem]"
          {...animation}
          transition={{ delay: 0.3 * 2 }}
        >
          <dt className="text-20 leading-120 text-neutral-400">WPM:</dt>
          <dd className="font-bold text-24 leading-100 text-white">{wpm}</dd>
        </motion.div>

        <motion.div
          className="px-24 py-16 border border-neutral-700 rounded-8 flex flex-col gap-y-12 lg:w-[10rem]"
          {...animation}
          transition={{ delay: 0.3 * 2.5 }}
        >
          <dt className="text-20 leading-120 text-neutral-400">Accuracy:</dt>
          <dd
            className={`font-bold text-24 leading-100 ${accuracy === 100 ? "text-green-500" : "text-red-500"}`}
          >
            {accuracy}%
          </dd>
        </motion.div>

        <motion.div
          className="px-24 py-16 border border-neutral-700 rounded-8 flex flex-col gap-y-12 lg:w-[10rem]"
          {...animation}
          transition={{ delay: 0.3 * 3 }}
        >
          <dt className="text-20 leading-120 text-neutral-400">Characters:</dt>
          <dd className="font-bold text-24 leading-100 text-neutral-500">
            <span className="text-green-500">{correctChar}</span>/
            <span className="text-red-500">{incorrectChar}</span>
          </dd>
        </motion.div>
      </dl>

      <motion.button
        className="button--secondary flex items-center gap-x-10 h-14"
        onClick={onRestart}
        {...animation}
        transition={{ delay: 0.3 * 3.5 }}
      >
        {content.textButton}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            fill="#000000"
            d="M1.563 1.281h.949c.246 0 .422.211.422.457l-.07 3.446a8.6 8.6 0 0 1 7.277-3.868c4.816 0 8.718 3.938 8.718 8.72-.035 4.816-3.937 8.683-8.718 8.683a8.86 8.86 0 0 1-5.871-2.215.446.446 0 0 1 0-.633l.703-.703c.14-.14.386-.14.562 0 1.23 1.09 2.813 1.723 4.606 1.723A6.88 6.88 0 0 0 17.03 10c0-3.797-3.093-6.89-6.89-6.89-2.813 0-5.203 1.687-6.293 4.078l4.43-.106c.245 0 .456.176.456.422v.95c0 .245-.21.421-.421.421h-6.75a.406.406 0 0 1-.422-.422v-6.75c0-.21.175-.422.422-.422"
          />
        </svg>
      </motion.button>

      {completionType !== "new-best" && (
        <div className="completed-pattern">
          <Image
            src="/images/pattern-star-1.svg"
            alt=""
            width="74"
            height="74"
            className="absolute w-9.75 h-auto bottom-0 right-0 translate-y-[calc(100%+2.75rem)] md:w-auto md:translate-y-1/2"
          />
          <Image
            src="/images/pattern-star-2.svg"
            alt=""
            width="32"
            height="32"
            className="absolute w-5.25 h-auto top-0 left-0 translate-y-[calc(100%+2.75rem)] md:w-auto md:translate-y-1/2"
          />
        </div>
      )}

      {completionType === "new-best" && (
        <div className="w-full h-42 new-best-pattern fixed bottom-0 -z-10 bg-[url('/images/pattern-confetti.svg')] bg-cover bg-center md:h-69.25 lg:h-81.5">
          {/* <Image
            src="/images/pattern-confetti.svg"
            alt=""
            width="1440"
            height="326"
          /> */}
        </div>
      )}
    </section>
  );
};

export default TestResults;
