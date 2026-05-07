import { useState, useEffect } from 'react'

export default function TypingAnimation({ text, speed = 80, className = '' }) {
  const [displayedText, setDisplayedText] = useState('')
  const [index, setIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [index, text, speed])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <span className={className}>
      {displayedText}
      <span
        className="inline-block w-[3px] h-[1em] bg-accent ml-1 align-middle"
        style={{ opacity: showCursor ? 1 : 0 }}
      />
    </span>
  )
}
