function getStorageKey(methodId) {
  return `think-first:session:v2:${methodId}`;
}

function createEmptySession() {
  return {
    stepIndex: 0,
    notes: {},
    isCompleted: false,
  };
}

export function loadSession(methodId, blocksCount) {
  try {
    const saved = localStorage.getItem(getStorageKey(methodId));

    if (!saved) return createEmptySession();

    const data = JSON.parse(saved);

    if (!data || typeof data !== "object") {
      return createEmptySession();
    }

    const stepIndex =
      Number.isInteger(data.stepIndex) &&
      data.stepIndex >= 0 &&
      data.stepIndex < blocksCount
        ? data.stepIndex
        : 0;

    const notes = {};

    if (
      data.notes &&
      typeof data.notes === "object" &&
      !Array.isArray(data.notes)
    ) {
      for (let index = 0; index < blocksCount; index += 1) {
        if (typeof data.notes[index] === "string") {
          notes[index] = data.notes[index];
        }
      }
    }

    const quizAnswers = {};

    if (
      data.quizAnswers &&
      typeof data.quizAnswers === "object" &&
      !Array.isArray(data.quizAnswers)
    ) {
      for (let index = 0; index < blocksCount; index += 1) {
        const answer = data.quizAnswers[index];

        if (Number.isInteger(answer) && answer >= 0 && answer <= 2) {
          quizAnswers[index] = answer;
        }
      }
    }

    return {
      stepIndex,
      notes,
      quizAnswers,
      isCompleted: data.isCompleted === true,
    };
  } catch {
    function createEmptySession() {
      return {
        stepIndex: 0,
        notes: {},
        quizAnswers: {},
        isCompleted: false,
      };
    }
  }
}

export function saveSession(methodId, session) {
  try {
    localStorage.setItem(getStorageKey(methodId), JSON.stringify(session));

    return true;
  } catch {
    return false;
  }
}
