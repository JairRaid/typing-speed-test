"use client";

import { useRef } from "react";
import { TestStatus } from "../../model/types";

interface TypingAreaProps {
  text: string;
  userInput: string;
  onInputChange: (value: string) => void;
  onStart: () => void;
  status: TestStatus;
}

const TypingArea = ({
  text,
  userInput,
  onInputChange,
  onStart,
  status,
}: TypingAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const isCompleted = userInput.length >= text.length;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(event.target.value.slice(0, text.length));
  };

  const handleStart = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      onStart();
    }
  };

  return (
    <section aria-label="Typing exercise" className="relative mt-32">
      {status === "idle" && (
        <div className="absolute w-full h-full backdrop-blur-[10px] flex flex-col justify-center items-center gap-y-20 font-semibold text-20 leading-120 -tracking-03 text-white">
          <button onClick={handleStart} className="button--primary">
            Start Typing Test
          </button>
          <span>Or click the text and start typing</span>
        </div>
      )}

      <label htmlFor="typing-input" className="">
        <span
          aria-hidden="true"
          className="text-neutral-400 text-32 leading-136 md:text-40"
        >
          {Array.from(text).map((character, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isCorrect = isTyped && userInput[index] === character;
            const isIncorrect = isTyped && userInput[index] !== character;

            return (
              <span
                key={index}
                className={`${isCorrect && "text-green-500"} ${isCurrent && "bg-neutral-400/25"} ${isIncorrect && "text-red-500 underline"}`}
              >
                {character}
              </span>
            );
          })}
        </span>

        <textarea
          ref={textareaRef}
          id="typing-input"
          aria-label="Type the passage here"
          value={userInput}
          onChange={handleChange}
          maxLength={text.length}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          className="sr-only"
        ></textarea>
      </label>
    </section>
  );
};

export default TypingArea;
