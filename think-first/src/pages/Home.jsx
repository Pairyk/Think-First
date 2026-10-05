import { Link } from "react-router";

const principles = [
  {
    number: "01",
    title: "Сначала попробуй сам",
    text: "Запиши свою идею или попытку решения, прежде чем обращаться к ИИ.",
  },
  {
    number: "02",
    title: "Дай ИИ конкретную роль",
    text: "Попроси одну подсказку, объяснение или проверку своей попытки.",
  },
  {
    number: "03",
    title: "Проверь понимание",
    text: "Объясни решение своими словами или выполни похожую задачу самостоятельно.",
  },
];

const methods = [
  {
    category: "Программирование",
    title: "Python Debugging",
    description: "Найди ошибку в коде и проверь свою гипотезу с помощью ИИ.",
    duration: "20 минут",
    steps: "Попытка → Материал → Решение → Проверка ИИ",
  },
  {
    category: "Математика",
    title: "Calculus Practice",
    description:
      "Попробуй решить задачу, получи подсказку и проверь понимание.",
    duration: "40 минут",
    steps: "Задача → Материал → Подсказка ИИ → Самопроверка",
  },
  {
    category: "Письмо",
    title: "Essay Improvement",
    description:
      "Напиши свой аргумент и используй обратную связь ИИ для его улучшения.",
    duration: "35 минут",
    steps: "Черновик → Проверка ИИ → Правки → Рефлексия",
  },
];

function Home() {
  return (
    <main id="home">
      <section className="hero container">
        <div className="hero-content">
          <p className="eyebrow">Учись осознанно</p>

          <h1>
            Сначала твоя мысль.
            <span> Затем помощь ИИ.</span>
          </h1>

          <p className="hero-description">
            Проходи учебные сценарии, в которых есть время для самостоятельной
            попытки, полезной подсказки и проверки понимания.
          </p>

          <Link className="button button-primary" to="/library">
            Выбрать методику
          </Link>

          <p className="hero-note">
            Начни с готового сценария и адаптируй его под свою задачу.
          </p>
        </div>

        <aside className="session-preview" aria-labelledby="preview-title">
          <p className="eyebrow">Пример учебной сессии</p>
          <h2 id="preview-title">От попытки к пониманию</h2>

          <ol className="session-steps">
            <li>
              <span className="step-number">1</span>
              <div>
                <h3>Самостоятельная попытка</h3>
                <p>Сформулируй подход и запиши, где возникла сложность.</p>
              </div>
            </li>
            <li>
              <span className="step-number">2</span>
              <div>
                <h3>Подсказка ИИ</h3>
                <p>Попроси направить тебя к следующему шагу.</p>
              </div>
            </li>
            <li>
              <span className="step-number">3</span>
              <div>
                <h3>Проверка понимания</h3>
                <p>Реши похожую задачу и объясни свой ход мыслей.</p>
              </div>
            </li>
          </ol>
        </aside>
      </section>

      <section className="principles-section" id="principles">
        <div className="container">
          <p className="eyebrow">Подход Think First</p>
          <h2 className="section-title">Три принципа работы с ИИ</h2>

          <div className="principles-grid">
            {principles.map((principle) => (
              <article className="principle" key={principle.number}>
                <span className="principle-number">{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="methods-section container" id="methods">
        <p className="eyebrow">С чего начать</p>
        <h2 className="section-title">Примеры учебных методик</h2>

        <div className="methods-grid">
          {methods.map((method) => (
            <article className="method-card" key={method.title}>
              <div className="method-meta">
                <span>{method.category}</span>
                <span>{method.duration}</span>
              </div>

              <h3>{method.title}</h3>
              <p className="method-description">{method.description}</p>
              <p className="method-steps">{method.steps}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
