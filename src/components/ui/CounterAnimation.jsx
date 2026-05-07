import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

export default function CounterAnimation({ from = 0, to, duration = 1.5, unit = '', className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: 'easeOut',
        onUpdate: (v) => setValue(Math.round(v)),
      })
      return () => controls.stop()
    }
  }, [isInView, from, to, duration])

  return (
    <span ref={ref} className={className}>
      {value}{unit}
    </span>
  )
}
