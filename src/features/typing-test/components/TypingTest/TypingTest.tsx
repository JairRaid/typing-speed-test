"use client";

import { useEffect, useRef, useState } from "react";
import TestHeader from "../TestHeader/TestHeader";
import TestSettingsBar from "../TestSettingsBar/TestSettingsBar";
import TestStats from "../TestStats/TestStats";
import TypingArea from "../TypingArea/TypingArea";
import { calculateTypingStats } from "../../model/typing-stats";
import { useTypingTest } from "../../hooks/useTypingTest";
import {
  CompletionType,
  TestDifficulty,
  TestDuration,
} from "../../model/types";
import { getPassage, PASSAGES } from "../../model/passages";
import TestResults from "../TestResults/TestResults";
import { useBestScore } from "../../hooks/useBestScore";

const DIFFICULTY_KEY = "typing-test-difficulty";
const DURATION_KEY = "typing-test-duration";

const TypingTest = () => {
  const [difficulty, setDifficulty] = useState<TestDifficulty>("easy");
  const [duration, setDuration] = useState<TestDuration>(60);
  const [passage, setPassage] = useState(PASSAGES.easy[0]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [completionType, setCompletionType] = useState<CompletionType | null>(
    null,
  );

  const {
    start,
    userInput,
    historicalIncorrectCharacters,
    status,
    timeRemaining,
    elapsedSeconds,
    handleInputChange,
    restart,
  } = useTypingTest({
    text: passage.text,
    duration: duration,
  });

  const previousStatus = useRef(status);

  const { bestWpm, hasPreviousResult, isLoaded, saveResult } = useBestScore();

  const stats = calculateTypingStats(
    passage.text,
    userInput,
    elapsedSeconds,
    historicalIncorrectCharacters,
  );

  const handleDifficultyChange = (nextDifficulty: TestDifficulty) => {
    setDifficulty(nextDifficulty);
    setPassage(getPassage(nextDifficulty));
  };

  const handleStart = () => {
    start();
  };

  const handleRestart = () => {
    setCompletionType(null);
    restart();
  };

  useEffect(() => {
    if (status === "completed") {
      saveResult(stats.wpm);
    }
  }, [status, stats.wpm, saveResult]);

  useEffect(() => {
    const justCompleted =
      previousStatus.current !== "completed" && status === "completed";

    previousStatus.current = status;

    if (!justCompleted || !isLoaded) {
      return;
    }

    // Determine the category BEFORE saving the current result.
    if (!hasPreviousResult) {
      setCompletionType("first-completion");
    } else if (stats.wpm > bestWpm) {
      setCompletionType("new-best");
    } else {
      setCompletionType("completed");
    }

    saveResult(stats.wpm);
  }, [status, isLoaded, hasPreviousResult, bestWpm, stats.wpm, saveResult]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let savedDifficulty: TestDifficulty = "easy";
      let savedDuration: TestDuration = 60;

      try {
        const storedDifficulty = localStorage.getItem(DIFFICULTY_KEY);
        if (
          storedDifficulty === "easy" ||
          storedDifficulty === "medium" ||
          storedDifficulty === "hard"
        ) {
          savedDifficulty = storedDifficulty;
        }

        const storedDuration = localStorage.getItem(DURATION_KEY);
        if (storedDuration === "0" || storedDuration === "60") {
          savedDuration = storedDuration === "0" ? 0 : 60;
        }
      } catch (error) {
        console.error(error);
      }

      setDifficulty(savedDifficulty);
      setDuration(savedDuration);
      setPassage(getPassage(savedDifficulty));
      setSettingsLoaded(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    localStorage.setItem(DIFFICULTY_KEY, difficulty);
  }, [difficulty, settingsLoaded]);

  useEffect(() => {
    if (!settingsLoaded) return;
    localStorage.setItem(DURATION_KEY, duration.toString());
  }, [duration, settingsLoaded]);

  return (
    <main className="p-16 md:p-32 lg:max-w-7xl lg:mx-auto">
      <TestHeader bestWpm={bestWpm} />

      {status === "completed" && completionType !== null && (
        <TestResults
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          correctChar={stats.correctCharacters}
          incorrectChar={stats.incorrectCharacters}
          onRestart={restart}
          completionType={completionType}
        />
      )}

      {status !== "completed" && (
        <section
          aria-label="Typing speed test"
          className="mt-32 md:mt-40 lg:mt-64"
        >
          <div className="flex flex-col gap-y-20 border-b border-b-neutral-700 pb-16 md:gap-y-16 lg:flex-row lg:items-center lg:justify-between">
            <TestStats
              wpm={stats.wpm}
              accuracy={stats.accuracy}
              timeRemaining={timeRemaining}
            />
            <TestSettingsBar
              difficulty={difficulty}
              duration={duration}
              onDifficultyChange={handleDifficultyChange}
              onDurationChange={setDuration}
            />
          </div>

          <TypingArea
            key={`${passage.id}-${duration}`}
            text={passage.text}
            userInput={userInput}
            onInputChange={handleInputChange}
            onStart={handleStart}
            status={status}
          />
        </section>
      )}

      {status === "running" && (
        <div className="pt-24 flex justify-center border-t border-neutral-700 mt-32 md:mt-40 lg:mt-64">
          <button
            className="font-semibold text-20 -tracking-03 text-white bg-neutral-800 px-16 py-10 rounded-12 flex items-center gap-x-10"
            onClick={handleRestart}
          >
            Restart Test{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fill="#fff"
                d="M1.563 1.281h.949c.246 0 .422.211.422.457l-.07 3.446a8.6 8.6 0 0 1 7.277-3.868c4.816 0 8.718 3.938 8.718 8.72-.035 4.816-3.937 8.683-8.718 8.683a8.86 8.86 0 0 1-5.871-2.215.446.446 0 0 1 0-.633l.703-.703c.14-.14.386-.14.562 0 1.23 1.09 2.813 1.723 4.606 1.723A6.88 6.88 0 0 0 17.03 10c0-3.797-3.093-6.89-6.89-6.89-2.813 0-5.203 1.687-6.293 4.078l4.43-.106c.245 0 .456.176.456.422v.95c0 .245-.21.421-.421.421h-6.75a.406.406 0 0 1-.422-.422v-6.75c0-.21.175-.422.422-.422"
              />
            </svg>
          </button>
        </div>
      )}
    </main>
  );
};

export default TypingTest;
