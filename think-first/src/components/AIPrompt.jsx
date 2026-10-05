import { useState } from 'react'

function AIPrompt({ prompt }) {
  const [status, setStatus] = useState('')

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setStatus('Промпт скопирован. Вставь его в чат и добавь свою попытку.')
    } catch {
      setStatus(
        'Не удалось скопировать автоматически. Выдели текст ниже и скопируй вручную.',
      )
    }
  }

  return (
    <section className="ai-prompt" aria-labelledby="ai-prompt-title">
      <p className="eyebrow">Помощь ИИ</p>
      <h3 id="ai-prompt-title">Промпт для внешнего чата</h3>

      <p className="ai-prompt-description">
        Скопируй запрос и замени текст в квадратных скобках своей попыткой.
        Полученный ответ проверь самостоятельно.
      </p>

      <pre className="ai-prompt-text">{prompt}</pre>

      <button
        className="button button-primary"
        type="button"
        onClick={copyPrompt}
      >
        Скопировать промпт
      </button>

      <p className="ai-prompt-status" role="status">
        {status}
      </p>
    </section>
  )
}

export default AIPrompt