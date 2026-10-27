"use client";

import { useCallback, useEffect, useState } from "react";

const BEST_WPM_KEY = "typing-speed-test-best-wpm";
const HAS_COMPLETED_KEY = "typing-speed-test-has-completed";

export const useBestScore = () => {
  const [bestWpm, setBestWpm] = useState(0);
  const [hasPreviousResult, setHasPreviousResult] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const updateResult = () => {
      try {
        const storedBest = Number(localStorage.getItem(BEST_WPM_KEY) ?? 0);

        if (Number.isSafeInteger(storedBest) && storedBest >= 0) {
          setBestWpm(storedBest);
        }

        setHasPreviousResult(
          localStorage.getItem(HAS_COMPLETED_KEY) === "true",
        );
      } catch {
        // Storage may be unavailable.
      } finally {
        setIsLoaded(true);
      }
    };

    updateResult();
  }, []);

  const saveResult = useCallback((wpm: number) => {
    if (!Number.isFinite(wpm) || wpm < 0) {
      return;
    }

    const score = Math.round(wpm);

    setBestWpm((currentBest) => Math.max(currentBest, score));
    setHasPreviousResult(true);

    try {
      window.localStorage.setItem(HAS_COMPLETED_KEY, "true");

      setBestWpm((currentBest) => {
        const nextBest = Math.max(currentBest, score);

        window.localStorage.setItem(BEST_WPM_KEY, String(nextBest));

        return nextBest;
      });
    } catch {
      // The current session still works without persistent storage.
    }
  }, []);

  return {
    bestWpm,
    hasPreviousResult,
    isLoaded,
    saveResult,
  };
};
