import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { loadSession, saveSession } from "../utils/sessionStorage";
import { getMethods } from "../utils/methodStorage";
import Timer from "../components/Timer";
import AIPrompt from "../components/AIPrompt";
import QuizBlock from "../components/QuizBlock";
import MaterialBlock from "../components/MaterialBlock";

function Session() {
  const { methodId } = useParams();
  const method = getMethods().find((item) => item.id === methodId);

  if (!method || !method.blocks?.length) {
    return (
      <main className="library-page container">
        <h1 className="section-title">Методика не найдена или пуста</h1>

        <Link className="button button-primary" to="/library">
          В библиотеку
        </Link>
      </main>
    );
  }

  return <SessionContent key={method.id} method={method} />;
}

function SessionContent({ method }) {
  const [session, setSession] = useState(() =>
    loadSession(method.id, method.blocks.length),
  );

  const [saveError, setSaveError] = useState(false);

  const { stepIndex, notes, isCompleted } = session;

  const currentBlock = method.blocks[stepIndex];
  const isLastStep = stepIndex === method.blocks.length - 1;

  useEffect(() => {
    const success = saveSession(method.id, session);
    setSaveError(!success);
  }, [method.id, session]);

  function updateNote(value) {
    setSession((previous) => ({
      ...previous,
      notes: {
        ...previous.notes,
        [previous.stepIndex]: value,
      },
    }));
  }

  function goNext() {
    setSession((previous) => {
      const lastStep = previous.stepIndex === method.blocks.length - 1;

      if (lastStep) {
        return {
          ...previous,
          isCompleted: true,
        };
      }

      return {
        ...previous,
        stepIndex: previous.stepIndex + 1,
      };
    });
  }

  function goBack() {
    setSession((previous) => ({
      ...previous,
      stepIndex: Math.max(0, previous.stepIndex - 1),
    }));
  }

  function restartSession() {
    setSession({
      stepIndex: 0,
      notes: {},
      quizAnswers: {},
      isCompleted: false,
    });
  }

  function updateQuizAnswer(value) {
    setSession((previous) => ({
      ...previous,
      quizAnswers: {
        ...(previous.quizAnswers ?? {}),
        [previous.stepIndex]: value,
      },
    }));
  }

  if (isCompleted) {
    return (
      <main className="session-page container">
        <p className="eyebrow">Сессия завершена</p>
        <h1 className="section-title">{method.title}</h1>

        <p className="library-description">
          Ты прошёл все этапы. Посмотри свои записи и подумай, что сможешь
          повторить самостоятельно.
        </p>

        {saveError && (
          <p className="notes-hint" role="status">
            Не удалось сохранить результат в браузере. Скопируй важные заметки
            перед закрытием страницы.
          </p>
        )}

        <div className="session-results">
          {method.blocks.map((block, index) => (
            <article className="result-card" key={index}>
              <h2>
                {index + 1}. {block.title}
              </h2>

              <p>{notes[index]?.trim() || "Без заметок."}</p>
              {block.quiz && (
                <p>
                  Ответ на самопроверку:{" "}
                  {block.quiz.options[session.quizAnswers?.[index]] ??
                    "Ответ не выбран."}
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="session-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={restartSession}
          >
            Пройти снова
          </button>

          <Link className="button button-secondary" to="/library">
            В библиотеку
          </Link>
        </div>

        <p className="notes-hint">
          «Пройти снова» удалит записи предыдущего прохождения этой методики.
        </p>
      </main>
    );
  }

  return (
    <main className="session-page container">
      <Link className="session-back-link" to="/library">
        В библиотеку
      </Link>

      <p className="eyebrow">Учебная сессия</p>
      <h1 className="section-title">{method.title}</h1>

      <div className="session-progress">
        <span>
          Этап {stepIndex + 1} из {method.blocks.length}
        </span>

        <progress
          aria-label="Текущий этап сессии"
          value={stepIndex + 1}
          max={method.blocks.length}
        />
      </div>

      <section className="session-block" aria-labelledby="block-title">
        <div className="method-meta">
          <span>Текущий этап</span>
          <span>Плановое время: {currentBlock.minutes} мин.</span>
        </div>

        <h2 id="block-title">{currentBlock.title}</h2>

        <p className="session-instruction">{currentBlock.instruction}</p>

        <Timer key={stepIndex} minutes={currentBlock.minutes} />
        {currentBlock.material && (
          <MaterialBlock
            material={currentBlock.material}
            sourceUrl={currentBlock.sourceUrl}
          />
        )}

        {currentBlock.prompt && (
          <AIPrompt key={stepIndex} prompt={currentBlock.prompt} />
        )}

        {currentBlock.quiz && (
          <QuizBlock
            quiz={currentBlock.quiz}
            answer={session.quizAnswers?.[stepIndex]}
            onAnswer={updateQuizAnswer}
          />
        )}

        <label className="notes-label" htmlFor="session-note">
          Твоя попытка или заметки
        </label>

        <textarea
          id="session-note"
          className="session-textarea"
          rows={7}
          value={notes[stepIndex] ?? ""}
          onChange={(event) => updateNote(event.target.value)}
          placeholder="Запиши свой подход, результат или вопрос…"
        />

        <p className="notes-hint" role="status">
          {saveError
            ? "Не удалось сохранить прогресс в браузере. Скопируй важные заметки перед закрытием страницы."
            : "Этап и заметки автоматически сохраняются в этом браузере."}
        </p>

        <div className="session-actions">
          <button
            className="button button-secondary"
            type="button"
            disabled={stepIndex === 0}
            onClick={goBack}
          >
            Назад
          </button>

          <button
            className="button button-primary"
            type="button"
            onClick={goNext}
          >
            {isLastStep ? "Завершить сессию" : "Следующий этап"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Session;
