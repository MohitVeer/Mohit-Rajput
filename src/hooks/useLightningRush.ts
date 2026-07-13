import { useCallback, useEffect, useRef, useState } from 'react'

const GAME_SECONDS = 20
const GRID_SIZE = 9
const ACTIVE_DURATION_MS = 850
const MIN_GAP_MS = 450
const MAX_GAP_MS = 900
const BEST_SCORE_KEY = 'lightning-rush-best-score'

function readBestScore(): number {
  if (typeof window === 'undefined') return 0
  const stored = window.localStorage.getItem(BEST_SCORE_KEY)
  const parsed = stored ? Number.parseInt(stored, 10) : 0
  return Number.isFinite(parsed) ? parsed : 0
}

export function useLightningRush() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(readBestScore)
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const spawnTimeoutRef = useRef<number | null>(null)
  const activeTimeoutRef = useRef<number | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)

  const clearAllTimers = useCallback(() => {
    if (spawnTimeoutRef.current) window.clearTimeout(spawnTimeoutRef.current)
    if (activeTimeoutRef.current) window.clearTimeout(activeTimeoutRef.current)
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current)
  }, [])

  const scheduleNextBolt = useCallback(() => {
    const gap = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS)
    spawnTimeoutRef.current = window.setTimeout(() => {
      const next = Math.floor(Math.random() * GRID_SIZE)
      setActiveCell(next)
      activeTimeoutRef.current = window.setTimeout(() => {
        setActiveCell(null)
        scheduleNextBolt()
      }, ACTIVE_DURATION_MS)
    }, gap)
  }, [])

  const endGame = useCallback(() => {
    clearAllTimers()
    setIsPlaying(false)
    setActiveCell(null)
    setScore((finalScore) => {
      setBest((prevBest) => {
        if (finalScore > prevBest) {
          window.localStorage.setItem(BEST_SCORE_KEY, String(finalScore))
          return finalScore
        }
        return prevBest
      })
      setAnnouncement(`Time's up! Final score: ${finalScore}.`)
      return finalScore
    })
  }, [clearAllTimers])

  const startGame = useCallback(() => {
    clearAllTimers()
    setScore(0)
    setTimeLeft(GAME_SECONDS)
    setActiveCell(null)
    setIsPlaying(true)
    setAnnouncement('Game started. Tap the lit blaze mark.')

    countdownIntervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          return 0
        }
        return t - 1
      })
    }, 1000)

    scheduleNextBolt()
  }, [clearAllTimers, scheduleNextBolt])

  // End the game the moment the clock hits zero
  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      endGame()
    }
  }, [isPlaying, timeLeft, endGame])

  const hitCell = useCallback(
    (index: number) => {
      if (!isPlaying || activeCell !== index) return
      setActiveCell(null)
      setScore((s) => {
        const next = s + 1
        setAnnouncement(`Score: ${next}`)
        return next
      })
      if (activeTimeoutRef.current) window.clearTimeout(activeTimeoutRef.current)
      scheduleNextBolt()
    },
    [isPlaying, activeCell, scheduleNextBolt],
  )

  useEffect(() => clearAllTimers, [clearAllTimers])

  return {
    isPlaying,
    timeLeft,
    score,
    best,
    activeCell,
    announcement,
    gridSize: GRID_SIZE,
    startGame,
    hitCell,
  }
}
