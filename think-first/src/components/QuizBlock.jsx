function QuizBlock({ quiz, answer, onAnswer }) {
  const hasAnswer = Number.isInteger(answer);
  const isCorrect = answer === quiz.correctIndex;

  return (
    <section className="session-quiz">
      <fieldset className="quiz-question">
        <legend>{quiz.question}</legend>

        {quiz.options.map((option, index) => (
          <label className="quiz-option" key={index}>
            <input
              type="radio"
              name="session-quiz"
              checked={answer === index}
              onChange={() => onAnswer(index)}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>

      {hasAnswer && (
        <div
          className={`quiz-feedback ${
            isCorrect ? "is-correct" : "is-incorrect"
          }`}
          role="status"
        >
          <p>
            <strong>
              {isCorrect ? "Верно." : "Попробуй разобраться ещё раз."}
            </strong>{" "}
            {quiz.explanation}
          </p>
        </div>
      )}
    </section>
  );
}

export default QuizBlock;