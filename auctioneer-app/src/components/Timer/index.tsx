import { FC, useEffect, useState } from 'react'
import styles from './styles.module.css'

type TimerProps = {
  counter: number
  style?: React.CSSProperties | undefined
}

const Timer: FC<TimerProps> = ({ counter, style }) => {
  const [minutes, setMinutes] = useState<string>('')
  const [seconds, setSeconds] = useState<string>('')

  useEffect(() => {
    const formatTimer = () => {
      const minutes = `0${Math.floor(counter / 60)}`.slice(-2)
      const seconds = `0${counter % 60}`.slice(-2)
      setMinutes(minutes)
      setSeconds(seconds)
    }

    formatTimer()
  }, [counter])

  return (
    <div className={styles.timer} style={style}>
      <span>{minutes}:{seconds}</span>
    </div>
  )
}

export default Timer