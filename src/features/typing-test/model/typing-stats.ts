export interface TypingStats {
  correctCharacters: number;
  incorrectCharacters: number;
  accuracy: number;
  wpm: number;
}

export const calculateCharacterCounts = (
  expectedText: string,
  userInput: string,
) => {
  let correctCharacters = 0;
  let incorrectCharacters = 0;

  const comparedLength = Math.min(expectedText.length, userInput.length);

  for (let index = 0; index < comparedLength; index++) {
    if (expectedText[index] === userInput[index]) {
      correctCharacters++;
    } else {
      incorrectCharacters++;
    }
  }

  return {
    correctCharacters,
    incorrectCharacters,
  };
};

export function calculateAccuracy(
  correctCharacters: number,
  incorrectCharacters: number,
): number {
  const totalCharacters = correctCharacters + incorrectCharacters;

  if (totalCharacters === 0) {
    return 100;
  }

  return Math.round((correctCharacters / totalCharacters) * 100);
}

export function calculateWpm(
  correctCharacters: number,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds <= 0) {
    return 0;
  }

  return Math.round((correctCharacters / 5) * (60 / elapsedSeconds));
}

export function calculateTypingStats(
  expectedText: string,
  userInput: string,
  elapsedSeconds: number,
  historicalIncorrectCharacters = 0,
): TypingStats {
  const {
    correctCharacters,
    incorrectCharacters: currentIncorrectCharacters,
  } = calculateCharacterCounts(expectedText, userInput);
  const incorrectCharacters =
    currentIncorrectCharacters + historicalIncorrectCharacters;

  return {
    correctCharacters,
    incorrectCharacters,
    accuracy: calculateAccuracy(correctCharacters, incorrectCharacters),
    wpm: calculateWpm(correctCharacters, elapsedSeconds),
  };
}
