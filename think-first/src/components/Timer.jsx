import { useEffect, useState } from 'react'

function Timer({ minutes }) {
  const initialSeconds = minutes * 60

  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const isFinished = secondsLeft === 0

  useEffect(() => {
    if (!isRunning || isFinished) return

    const intervalId = setInterval(() => {
      setSecondsLeft((previous) => Math.max(0, previous - 1))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning, isFinished])

  function resetTimer() {
    setIsRunning(false)
    setSecondsLeft(initialSeconds)
  }

  const minutesLeft = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const formattedTime =
    `${String(minutesLeft).padStart(2, '0')}:` +
    String(seconds).padStart(2, '0')

  return (
    <div className="timer">
      <div>
        <p className="timer-label">Время на этап</p>
        <p className="timer-value" role="timer" aria-label="Оставшееся время">
          {formattedTime}
        </p>
      </div>

      <div className="timer-controls">
        <button
          className="button button-secondary"
          type="button"
          disabled={isFinished}
          onClick={() => setIsRunning((previous) => !previous)}
        >
          {isRunning && !isFinished ? 'Пауза' : 'Старт'}
        </button>

        <button
          className="button button-secondary"
          type="button"
          onClick={resetTimer}
        >
          Сбросить
        </button>
      </div>

      {isFinished && (
        <p className="timer-message" role="status">
          Плановое время закончилось. Можешь продолжить работу
          или перейти к следующему этапу.
        </p>
      )}
    </div>
  )
}

export default Timer