import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import BidCard from '../../components/BidCard'
import { SocketContext } from '../../context/SocketContext'
import { Auction } from '../../models/Auction'
import { Bid } from '../../models/Bid'
import styles from './styles.module.css'
import Timer from '../../components/Timer'
import ResultModal from '../../components/ResultModal'

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
  const [resultModalVisible, isResultModalVisible] = useState<boolean>(false)
  const [winner, setWinner] = useState<Bid | undefined>()
  let longTimer: NodeJS.Timer
  let shortTimer: NodeJS.Timer

  const setUpLongCounter = (timeout: number) => {
    if (!auction) {
      return
    }

    clearInterval(longTimer)
    
    setLongCounter(timeout)
    
    longTimer = (
      setInterval(() => {
        setLongCounter((counter) => counter - 1)

        if (longCounter < 0) {
          clearInterval(longTimer)
        }
      }, 1000)
    )
  }

  const setUpShortCounter = (timeout: number) => {
    clearInterval(shortTimer)
    
    setShortCounter(timeout)
    
    shortTimer = (
      setInterval(() => {
        setShortCounter((counter) => counter - 1)

        if (shortCounter < 0) {
          clearInterval(shortTimer)
        }
      }, 1000)
    )
  }

  const handlePreviousBids = useCallback((bids: Bid[]) => {
    console.log('Previous bids')
    console.log(bids)

    setBids(bids)
  }, [bids])

  const handleBidReceived = useCallback((bid: Bid) => {
    console.log('Bid received')
    console.log(bid)
  
    const updatedBids = [...bids, bid]
    setBids(updatedBids)
    setShortCounter(30)
  }, [bids])

  const handleShortCounter = useCallback((shortCounter: number) => {
    if (shortCounter === 0) {
      return
    }

    console.log('Short counter', shortCounter)
    setUpShortCounter(30 - shortCounter)
  }, [])

  const handleLongCounter = useCallback((longCounter: number) => {
    if (longCounter === 0) {
      return
    }

    console.log('Long counter', longCounter)
    setUpLongCounter(longCounter)
  }, [])

  const handleCancelAuction = useCallback((bids: Bid[]) => {
    if (shortCounter === 1) {
      setShortCounter(0)
    }

    clearInterval(shortTimer)
    clearInterval(longTimer)

    const winner = bids.pop()

    if (winner) {
      setWinner(winner)
    }

    isResultModalVisible(true)
  }, [])

  useEffect(() => {
    if (!auction) {
      return
    }
    
    setUpLongCounter(auction.timeout)
    setUpShortCounter(30)
  }, [auction])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_BID_RECEIVED_EVENT}`, handleBidReceived)
    return () => {
      socket.off(`${process.env.REACT_APP_BID_RECEIVED_EVENT}`)
    }
  })

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_CANCEL_AUCTION_EVENT}`, handleCancelAuction)
    return () => {
      socket.off(`${process.env.REACT_APP_CANCEL_AUCTION_EVENT}`)
    }
  })
  
  useEffect(() => {
    socket.on(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`, handlePreviousBids)
    return () => {
      socket.off(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`)
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
    <>
      {(auction) && (
        <ResultModal
          visible={resultModalVisible}
          winner={winner}
          auction={auction}
          longCounter={auction.timeout - longCounter}
          bids={bids}
        />
      )}

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
      </div>
    </>
  )
}

export default LiveAuction