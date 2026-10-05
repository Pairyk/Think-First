import { useState } from "react";
import { useNavigate } from "react-router";
import { saveCustomMethod } from "../utils/methodStorage";

const blockTypes = [
  { type: "focus", label: "Focus — самостоятельная попытка" },
  { type: "material", label: "Material — изучение материала" },
  { type: "task", label: "Task — выполнение задания" },
  { type: "ai", label: "AI — помощь ИИ" },
  { type: "quiz", label: "Quiz — самопроверка" },
  { type: "reflection", label: "Reflection — рефлексия" },
];

function Builder() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Программирование");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("focus");
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate();

  const [methodId] = useState(() => `custom-${crypto.randomUUID()}`);
  const [error, setError] = useState("");

  function addBlock() {
    const selected = blockTypes.find((item) => item.type === selectedType);

    const block = {
      id: crypto.randomUUID(),
      type: selectedType,
      title: selected.label.split(" — ")[0],
      minutes: 5,
      instruction: "",
      prompt: "",
      material: "",
      sourceUrl: "",
      quiz:
        selectedType === "quiz"
          ? {
              question: "",
              options: ["", "", ""],
              correctIndex: 0,
              explanation: "",
            }
          : null,
    };

    setBlocks((previous) => [...previous, block]);
  }

  function updateBlock(id, field, value) {
    setBlocks((previous) =>
      previous.map((block) =>
        block.id === id ? { ...block, [field]: value } : block,
      ),
    );
  }

  function removeBlock(id) {
    setBlocks((previous) => previous.filter((block) => block.id !== id));
  }

  function moveBlock(id, direction) {
    setBlocks((previous) => {
      const index = previous.findIndex((block) => block.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= previous.length) {
        return previous;
      }

      const reordered = [...previous];

      [reordered[index], reordered[nextIndex]] = [
        reordered[nextIndex],
        reordered[index],
      ];

      return reordered;
    });
  }

  const totalMinutes = blocks.reduce(
    (total, block) => total + (Number(block.minutes) || 0),
    0,
  );

  function handleSave() {
    setError("");

    if (!title.trim()) {
      setError("Укажи название методики.");
      return;
    }

    if (!description.trim()) {
      setError("Опиши цель методики.");
      return;
    }

    if (blocks.length === 0) {
      setError("Добавь хотя бы один учебный этап.");
      return;
    }

    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index];

      if (!block.title.trim()) {
        setError(`Укажи название этапа ${index + 1}.`);
        return;
      }

      if (
        !Number.isInteger(block.minutes) ||
        block.minutes < 1 ||
        block.minutes > 180
      ) {
        setError(`Для этапа ${index + 1} укажи целое время от 1 до 180 минут.`);
        return;
      }

      if (!block.instruction.trim()) {
        setError(`Добавь инструкцию для этапа ${index + 1}.`);
        return;
      }

      if (block.type === "material") {
        if (!block.material?.trim()) {
          setError(`Добавь учебный материал для этапа ${index + 1}.`);
          return;
        }

        if (block.sourceUrl?.trim()) {
          try {
            const url = new URL(block.sourceUrl.trim());

            if (!["http:", "https:"].includes(url.protocol)) {
              throw new Error("Unsupported protocol");
            }
          } catch {
            setError(
              `Для этапа ${index + 1} укажи полную ссылку с http:// или https://.`,
            );
            return;
          }
        }
      }

      if (block.type === "ai" && !block.prompt.trim()) {
        setError(`Добавь промпт для этапа ${index + 1}.`);
        return;
      }

      if (block.type === "quiz") {
        if (
          !block.quiz?.question.trim() ||
          block.quiz.options.some((option) => !option.trim()) ||
          !block.quiz.explanation.trim()
        ) {
          setError(
            `Для этапа ${index + 1} заполни вопрос, три варианта и объяснение.`,
          );
          return;
        }
      }
    }

    const method = {
      id: methodId,
      title: title.trim(),
      category,
      description: description.trim(),
      blocks: blocks.map((block) => ({
        ...block,
        title: block.title.trim(),
        instruction: block.instruction.trim(),
        prompt: block.type === "ai" ? block.prompt.trim() : "",
      })),
    };

    const success = saveCustomMethod(method);

    if (!success) {
      setError("Не удалось сохранить методику в браузере. Попробуй ещё раз.");
      return;
    }

    navigate("/library");
  }

  function updateQuiz(id, field, value) {
    setBlocks((previous) =>
      previous.map((block) =>
        block.id === id
          ? {
              ...block,
              quiz: {
                ...block.quiz,
                [field]: value,
              },
            }
          : block,
      ),
    );
  }

  return (
    <main className="builder-page container">
      <p className="eyebrow">Конструктор</p>
      <h1 className="section-title">Создай свою методику</h1>
      <p className="library-description">
        Определи цель и собери последовательность учебных этапов.
      </p>

      <section className="builder-panel" aria-labelledby="method-settings">
        <h2 id="method-settings">О методике</h2>

        <label className="builder-field">
          <span>Название</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например: подготовка к экзамену"
          />
        </label>

        <label className="builder-field">
          <span>Предмет</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Программирование</option>
            <option>Математика</option>
            <option>Языки</option>
            <option>Письмо</option>
          </select>
        </label>

        <label className="builder-field">
          <span>Цель методики</span>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Что ты хочешь понять или научиться делать?"
          />
        </label>
      </section>

      <section className="builder-panel" aria-labelledby="blocks-heading">
        <div className="builder-heading">
          <h2 id="blocks-heading">Учебные этапы</h2>
          <span className="builder-total">
            {blocks.length} этапов · {totalMinutes} мин.
          </span>
        </div>

        <div className="builder-add">
          <label className="builder-field">
            <span>Тип нового блока</span>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              {blockTypes.map((item) => (
                <option key={item.type} value={item.type}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button
            className="button button-primary"
            type="button"
            onClick={addBlock}
          >
            Добавить блок
          </button>
        </div>

        {blocks.length === 0 ? (
          <p className="builder-empty">
            Пока нет этапов. Добавь первый блок, например самостоятельную
            попытку.
          </p>
        ) : (
          <ol className="builder-blocks">
            {blocks.map((block, index) => (
              <li className="builder-block" key={block.id}>
                <div className="builder-heading">
                  <h3>
                    Этап {index + 1} ·{" "}
                    {blockTypes.find((item) => item.type === block.type)?.label}
                  </h3>

                  <div className="block-controls">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveBlock(block.id, -1)}
                      aria-label={`Переместить этап ${index + 1} выше`}
                    >
                      Выше
                    </button>

                    <button
                      type="button"
                      disabled={index === blocks.length - 1}
                      onClick={() => moveBlock(block.id, 1)}
                      aria-label={`Переместить этап ${index + 1} ниже`}
                    >
                      Ниже
                    </button>

                    <button
                      className="delete-block"
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      aria-label={`Удалить этап ${index + 1}`}
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <label className="builder-field">
                  <span>Название этапа</span>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(event) =>
                      updateBlock(block.id, "title", event.target.value)
                    }
                  />
                </label>

                <label className="builder-field">
                  <span>Время в минутах</span>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    step="1"
                    value={block.minutes}
                    onChange={(event) =>
                      updateBlock(
                        block.id,
                        "minutes",
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                      )
                    }
                  />
                </label>

                <label className="builder-field">
                  <span>Инструкция</span>
                  <textarea
                    rows={3}
                    value={block.instruction}
                    onChange={(event) =>
                      updateBlock(block.id, "instruction", event.target.value)
                    }
                    placeholder="Что нужно сделать на этом этапе?"
                  />
                </label>

                {block.type === "material" && (
                  <>
                    <label className="builder-field">
                      <span>Учебный материал</span>
                      <textarea
                        rows={6}
                        value={block.material ?? ""}
                        onChange={(event) =>
                          updateBlock(block.id, "material", event.target.value)
                        }
                        placeholder="Добавь объяснение, правило или пример."
                      />
                    </label>

                    <label className="builder-field">
                      <span>Ссылка на источник — необязательно</span>
                      <input
                        type="url"
                        value={block.sourceUrl ?? ""}
                        onChange={(event) =>
                          updateBlock(block.id, "sourceUrl", event.target.value)
                        }
                        placeholder="https://..."
                      />
                    </label>
                  </>
                )}

                {block.type === "ai" && (
                  <label className="builder-field">
                    <span>Промпт для ИИ</span>
                    <textarea
                      rows={5}
                      value={block.prompt}
                      onChange={(event) =>
                        updateBlock(block.id, "prompt", event.target.value)
                      }
                      placeholder="Опиши роль ИИ и какую помощь ты хочешь получить."
                    />
                  </label>
                )}

                {block.type === "quiz" && (
                  <>
                    <label className="builder-field">
                      <span>Вопрос самопроверки</span>
                      <textarea
                        rows={2}
                        value={block.quiz.question}
                        onChange={(event) =>
                          updateQuiz(block.id, "question", event.target.value)
                        }
                      />
                    </label>

                    {block.quiz.options.map((option, optionIndex) => (
                      <label className="builder-field" key={optionIndex}>
                        <span>Вариант {optionIndex + 1}</span>
                        <input
                          type="text"
                          value={option}
                          onChange={(event) =>
                            updateQuiz(
                              block.id,
                              "options",
                              block.quiz.options.map((item, index) =>
                                index === optionIndex
                                  ? event.target.value
                                  : item,
                              ),
                            )
                          }
                        />
                      </label>
                    ))}

                    <label className="builder-field">
                      <span>Правильный вариант</span>
                      <select
                        value={block.quiz.correctIndex}
                        onChange={(event) =>
                          updateQuiz(
                            block.id,
                            "correctIndex",
                            Number(event.target.value),
                          )
                        }
                      >
                        <option value={0}>Вариант 1</option>
                        <option value={1}>Вариант 2</option>
                        <option value={2}>Вариант 3</option>
                      </select>
                    </label>

                    <label className="builder-field">
                      <span>Объяснение ответа</span>
                      <textarea
                        rows={3}
                        value={block.quiz.explanation}
                        onChange={(event) =>
                          updateQuiz(
                            block.id,
                            "explanation",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                  </>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="builder-save">
        {error && (
          <p className="builder-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="button button-primary"
          type="button"
          onClick={handleSave}
        >
          Сохранить в библиотеку
        </button>

        <p className="notes-hint">
          Методика сохранится в этом браузере. Несохранённые изменения исчезнут
          после ухода со страницы.
        </p>
      </div>
    </main>
  );
}

export default Builder;
