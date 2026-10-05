import { useState } from "react";
import { Link } from "react-router";

const cards = [
  {
    title: "ИИ может ошибаться",
    text: "Уверенный ответ не гарантирует правильность. Проверяй факты, вычисления и ссылки.",
    example:
      "Если ИИ привёл источник, открой его и проверь, подтверждает ли он утверждение.",
  },
  {
    title: "Сначала попробуй сам",
    text: "Перед обращением к ИИ запиши свой подход и место, где возникла сложность.",
    example:
      "«Я попробовал этот способ, получил такой результат, но не понимаю следующий шаг».",
  },
  {
    title: "Дай ИИ конкретную роль",
    text: "Определи, какая помощь нужна: подсказка, объяснение или проверка твоей попытки.",
    example:
      "«Дай одну подсказку без полного решения и дождись моей следующей попытки».",
  },
  {
    title: "Проверь понимание",
    text: "После помощи ИИ попробуй применить идею самостоятельно.",
    example:
      "Реши похожую задачу без подсказки и объясни, почему твой способ работает.",
  },
];

const questions = [
  {
    id: "sources",
    title: "ИИ дал убедительный ответ со ссылкой. Что делать?",
    options: [
      "Использовать ответ без проверки",
      "Открыть источник и проверить утверждение",
      "Попросить ИИ звучать ещё увереннее",
    ],
    correctIndex: 1,
    explanation:
      "Убедительная формулировка не подтверждает достоверность. Ссылка может быть неверной или не поддерживать утверждение.",
  },
  {
    id: "hint",
    title: "Какой запрос помогает сохранить самостоятельную работу?",
    options: [
      "Реши задачу за меня",
      "Напиши готовый ответ для сдачи",
      "Посмотри мою попытку и дай одну подсказку",
    ],
    correctIndex: 2,
    explanation:
      "Разбор своей попытки и небольшая подсказка оставляют следующий шаг решения за тобой.",
  },
  {
    id: "understanding",
    title: "Как проверить понимание после объяснения ИИ?",
    options: [
      "Самостоятельно решить похожую задачу",
      "Скопировать объяснение в заметки",
      "Спросить ИИ, всё ли я понял",
    ],
    correctIndex: 0,
    explanation:
      "Самостоятельное применение помогает проверить, можешь ли ты использовать идею без готовой подсказки.",
  },
];

function AIBasics() {
  const [cardIndex, setCardIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const currentCard = cards[cardIndex];
  const isLastCard = cardIndex === cards.length - 1;

  const score = questions.filter(
    (question) => answers[question.id] === question.correctIndex,
  ).length;

  function selectAnswer(questionId, optionIndex) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionIndex,
    }));

    setError("");
  }

  function checkAnswers(event) {
    event.preventDefault();

    const allAnswered = questions.every(
      (question) => Number.isInteger(answers[question.id]),
    );

    if (!allAnswered) {
      setError("Выбери ответ на каждый вопрос.");
      return;
    }

    setError("");
    setSubmitted(true);
  }

  function retryQuiz() {
    setAnswers({});
    setSubmitted(false);
    setError("");
  }

  return (
    <main className="basics-page container">
      <p className="eyebrow">Основы ИИ</p>
      <h1 className="section-title">Используй ИИ осознанно</h1>

      <p className="library-description">
        Четыре принципа, которые помогут организовать работу с помощником.
      </p>

      {!showQuiz ? (
        <>
          <section className="basics-card" aria-labelledby="basics-card-title">
            <p className="eyebrow">
              Карточка {cardIndex + 1} из {cards.length}
            </p>

            <h2 id="basics-card-title">{currentCard.title}</h2>
            <p className="basics-text">{currentCard.text}</p>

            <div className="basics-example">
              <h3>Например</h3>
              <p>{currentCard.example}</p>
            </div>
          </section>

          <div className="session-actions">
            <button
              className="button button-secondary"
              type="button"
              disabled={cardIndex === 0}
              onClick={() => setCardIndex((previous) => previous - 1)}
            >
              Назад
            </button>

            <button
              className="button button-primary"
              type="button"
              onClick={() => {
                if (isLastCard) {
                  setShowQuiz(true);
                } else {
                  setCardIndex((previous) => previous + 1);
                }
              }}
            >
              {isLastCard ? "К самопроверке" : "Далее"}
            </button>

            <Link className="button button-secondary" to="/library">
              Пропустить и посмотреть методики
            </Link>
          </div>
        </>
      ) : (
        <form className="basics-quiz" onSubmit={checkAnswers}>
          <h2>Короткая самопроверка</h2>

          {questions.map((question, questionIndex) => {
            const isCorrect =
              answers[question.id] === question.correctIndex;

            return (
              <fieldset className="quiz-question" key={question.id}>
                <legend>
                  {questionIndex + 1}. {question.title}
                </legend>

                {question.options.map((option, optionIndex) => (
                  <label className="quiz-option" key={optionIndex}>
                    <input
                      type="radio"
                      name={question.id}
                      value={optionIndex}
                      checked={answers[question.id] === optionIndex}
                      disabled={submitted}
                      onChange={() =>
                        selectAnswer(question.id, optionIndex)
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}

                {submitted && (
                  <div
                    className={`quiz-feedback ${
                      isCorrect ? "is-correct" : "is-incorrect"
                    }`}
                  >
                    <p>
                      <strong>
                        {isCorrect ? "Верно." : "Стоит пересмотреть ответ."}
                      </strong>{" "}
                      {question.explanation}
                    </p>

                    {!isCorrect && (
                      <p>
                        Правильный ответ:{" "}
                        {question.options[question.correctIndex]}.
                      </p>
                    )}
                  </div>
                )}
              </fieldset>
            );
          })}

          {error && (
            <p className="builder-error" role="alert">
              {error}
            </p>
          )}

          {submitted && (
            <p className="quiz-score" role="status">
              Правильных ответов: {score} из {questions.length}.
            </p>
          )}

          <div className="session-actions">
            {!submitted ? (
              <>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setShowQuiz(false)}
                >
                  К карточкам
                </button>

                <button className="button button-primary" type="submit">
                  Проверить ответы
                </button>
              </>
            ) : (
              <>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={retryQuiz}
                >
                  Попробовать снова
                </button>

                <Link className="button button-primary" to="/library">
                  В библиотеку
                </Link>
              </>
            )}
          </div>
        </form>
      )}
    </main>
  );
}

export default AIBasics;