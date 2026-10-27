"use client";

import { useCallback, useEffect, useState } from "react";

export type TestStatus = "idle" | "running" | "completed";

interface UseTypingTestOptions {
  text: string;
  duration: number;
}

export const useTypingTest = ({ text, duration }: UseTypingTestOptions) => {
  const [userInput, setUserInput] = useState("");
  const [historicalIncorrectCharacters, setHistoricalIncorrectCharacters] =
    useState(0);
  const [status, setStatus] = useState<TestStatus>("idle");
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const start = useCallback(() => {
    setStatus((current) => (current === "idle" ? "running" : current));
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      if (status === "completed") {
        return;
      }

      const nextInput = value.slice(0, text.length);
      let unchangedPrefixLength = 0;

      while (
        unchangedPrefixLength < userInput.length &&
        unchangedPrefixLength < nextInput.length &&
        userInput[unchangedPrefixLength] === nextInput[unchangedPrefixLength]
      ) {
        unchangedPrefixLength++;
      }

      let unchangedSuffixLength = 0;
      while (
        unchangedSuffixLength < userInput.length - unchangedPrefixLength &&
        unchangedSuffixLength < nextInput.length - unchangedPrefixLength &&
        userInput[userInput.length - unchangedSuffixLength - 1] ===
          nextInput[nextInput.length - unchangedSuffixLength - 1]
      ) {
        unchangedSuffixLength++;
      }

      let removedIncorrectCharacters = 0;
      for (
        let index = unchangedPrefixLength;
        index < userInput.length - unchangedSuffixLength;
        index++
      ) {
        if (userInput[index] !== text[index]) {
          removedIncorrectCharacters++;
        }
      }

      setUserInput(nextInput);
      if (removedIncorrectCharacters > 0) {
        setHistoricalIncorrectCharacters(
          (count) => count + removedIncorrectCharacters,
        );
      }

      if (nextInput.length > 0 && status === "idle") {
        setStatus("running");
      }

      if (nextInput.length >= text.length) {
        setStatus("completed");
      }
    },
    [status, text, userInput],
  );

  const restart = useCallback(() => {
    setUserInput("");
    setHistoricalIncorrectCharacters(0);
    setTimeRemaining(duration);
    setStatus("idle");
    setElapsedSeconds(0);
  }, [duration]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const intervalId = setInterval(() => {
      if (duration === 0) {
        setElapsedSeconds((elapsed) => elapsed + 1);
      } else {
        setTimeRemaining((current) => Math.max(0, current - 1));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, duration]);

  useEffect(() => {
    if (status === "running" && duration !== 0 && timeRemaining === 0) {
      // Break the synchronous render cycle
      const timeout = setTimeout(() => {
        setStatus("completed");
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [status, timeRemaining, duration]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUserInput("");
      setHistoricalIncorrectCharacters(0);
      setTimeRemaining(duration);
      setStatus("idle");
      setElapsedSeconds(0);
    }, 0);

    return () => clearTimeout(timeout);
  }, [text, duration]);

  return {
    start,
    userInput,
    historicalIncorrectCharacters,
    status,
    timeRemaining,
    elapsedSeconds: duration === 0 ? elapsedSeconds : duration - timeRemaining,
    handleInputChange,
    restart,
  };
};
