import { useState } from "react";
import { Link } from "react-router";
import { getMethods } from "../utils/methodStorage";

const categories = [
  "Все",
  "Программирование",
  "Математика",
  "Языки",
  "Письмо",
];

function Library() {
  const [methods] = useState(() => getMethods());
  const [category, setCategory] = useState("Все");

  const filteredMethods = methods.filter(
    (method) => category === "Все" || method.category === category,
  );

  return (
    <main className="library-page container">
      <p className="eyebrow">Библиотека</p>
      <h1 className="section-title">Учебные методики</h1>
      <p className="library-description">
        Выбери предмет и посмотри, как устроена учебная сессия.
      </p>

      <div
        className="category-filters"
        role="group"
        aria-label="Фильтр по предмету"
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={`filter-button ${category === item ? "is-active" : ""}`}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="methods-grid">
        {filteredMethods.map((method) => {
          const duration = method.blocks.reduce(
            (total, block) => total + block.minutes,
            0,
          );

          return (
            <article className="method-card" key={method.id}>
              <div className="method-meta">
                <span>{method.category}</span>
                <span>{duration} минут</span>
              </div>

              <h2 className="method-title">{method.title}</h2>
              <p className="method-description">{method.description}</p>

              <details className="method-details">
                <summary>Посмотреть этапы</summary>

                <ol className="block-list">
                  {method.blocks.map((block, index) => (
                    <li key={`${method.id}-${index}`}>
                      <h3>{block.title}</h3>
                      <span className="block-duration">
                        {block.minutes} мин.
                      </span>
                      <p>{block.instruction}</p>
                    </li>
                  ))}
                </ol>
              </details>
              <Link
                className="button button-primary"
                to={`/session/${method.id}`}
              >
                Начать сессию
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default Library;
