import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import BidCard from '../../components/BidCard'
import { SocketContext } from '../../context/SocketContext'
import { Auction } from '../../models/Auction'
import { Bid } from '../../models/Bid'
import styles from './styles.module.css'
import Timer from '../../components/Timer'

type Location = {
  state?: {
    auction: Auction
  }
}

const LiveAuction = () => {
  const location: Location = useLocation()
  const { auction } = location.state || {}
  const [bids, setBids] = useState<Bid[]>([])
  const { socket } = useContext(SocketContext)
  const bottomEl = useRef<HTMLDivElement>(null)
  const [longCounter, setLongCounter] = useState<number>(0)
  const [shortCounter, setShortCounter] = useState<number>(0)
  let longTimer: NodeJS.Timer
  let shortTimer: NodeJS.Timer

  const cancelAuction = () => {
    socket.emit(`${process.env.REACT_APP_CANCEL_AUCTION_EVENT}`)
  }

  const setUpLongCounter = (timeout: number) => {
    if (!auction) {
      return
    }

    clearInterval(longTimer)
    
    console.log(timeout)

    setLongCounter(timeout)
    
    longTimer = (
      setInterval(() => {
        setLongCounter((counter) => counter - 1)
      }, 1000)
    )
  }

  const setUpShortCounter = (timeout: number) => {
    clearInterval(shortTimer)
    
    setShortCounter(timeout)
    
    shortTimer = (
      setInterval(() => {
        setShortCounter((counter) => counter - 1)
      }, 1000)
    )
  }

  const handlePreviousMessages = useCallback((messageObj: Bid[]) => {
    console.log('Previous messages')
    console.log(messageObj)

    setBids(messageObj)
  }, [bids])

  const handleMessageReceived = useCallback((bid: Bid) => {
    console.log('Message received')
    console.log(bid)
  
    const updatedBids = [...bids, bid]
    setBids(updatedBids)
  }, [bids])

  const handleShortCounter = useCallback((shortCounter: number) => {
    if (shortCounter === 0) {
      return
    }

    console.log('Short counter', shortCounter)
    setUpShortCounter(shortCounter)
  }, [])

  const handleLongCounter = useCallback((longCounter: number) => {
    if (longCounter === 0) {
      return
    }

    console.log('Long counter', longCounter)
    setUpLongCounter(longCounter)
  }, [])

  const handleTimeout = useCallback(() => {
    socket.emit(`${process.env.REACT_APP_CANCEL_AUCTION_EVENT}`)
  }, [])

  useEffect(() => {
    if (!auction) {
      return
    }
    
    console.log(auction)

    setUpLongCounter(auction.timeout)
    setUpShortCounter(30)
  }, [auction])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_MESSAGE_RECEIVED_EVENT}`, handleMessageReceived)
    return () => {
      socket.off(`${process.env.REACT_APP_MESSAGE_RECEIVED_EVENT}`)
    }
  })

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_TIMEOUT_EVENT}`, handleTimeout)
    return () => {
      socket.off(`${process.env.REACT_APP_TIMEOUT_EVENT}`)
    }
  })
  
  useEffect(() => {
    socket.on(`${process.env.REACT_APP_PREVIOUS_MESSAGES_EVENT}`, handlePreviousMessages)
    return () => {
      socket.off(`${process.env.REACT_APP_PREVIOUS_MESSAGES_EVENT}`)
    }
  }, [])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_SHORT_COUNTER_EVENT}`, handleShortCounter)
    return () => {
      socket.off(`${process.env.REACT_APP_SHORT_COUNTER_EVENT}`)
    }
  }, [])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_LONG_COUNTER_EVENT}`, handleLongCounter)
    return () => {
      socket.off(`${process.env.REACT_APP_LONG_COUNTER_EVENT}`)
    }
  }, [])

  useEffect(() => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bids])

  if (!location.state || !socket.connected) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={styles.container}>
      <Timer counter={longCounter} />
      <Timer counter={shortCounter} style={{
        top: '64px',
        width: '96px',
        height: '48px',
        fontSize: '75%',
        backgroundColor: '#e74c3c',
      }} />

      {(auction) && <h1 className={styles.auctionTitle}>Leilão ao vivo do item "{auction.title}"</h1>}

      <div id='scroll-area' className={styles.liveAuctionArea}>
        {bids.map((b, index) => <BidCard key={index} bid={b} />)}

        <div ref={bottomEl}></div>
      </div>

      <div className={styles.cancelAuctionButton} onClick={cancelAuction}>
        <span>Finalizar leilão</span>
      </div>
    </div>
  )
}

export default LiveAuction