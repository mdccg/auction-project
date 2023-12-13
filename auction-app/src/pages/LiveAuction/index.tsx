import { FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
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
    username: string
  }
}

const LiveAuction = () => {
  const location: Location = useLocation()
  const { auction, username } = location.state || {}
  const [bids, setBids] = useState<Bid[]>([])
  const { socket } = useContext(SocketContext)
  const bottomEl = useRef<HTMLDivElement>(null)
  const [longCounter, setLongCounter] = useState<number>(0)
  const [shortCounter, setShortCounter] = useState<number>(0)
  const [resultModalVisible, isResultModalVisible] = useState<boolean>(false)
  let longTimer: NodeJS.Timer
  let shortTimer: NodeJS.Timer

  const [higherValue, setHigherValue] = useState<number>(auction?.initialBid || 0)
  const [bidMine, setBidMine] = useState<string>('')

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
    setHigherValue(bids.at(bids.length - 1)?.value || 0)
  }, [bids])

  const handleBidReceived = useCallback((bid: Bid) => {
    console.log('Bid received')
    console.log(bid)
  
    const updatedBids = [...bids, bid]

    setBids(updatedBids)
    setShortCounter(30)
    setHigherValue(bid.value)
  }, [bids])

  const handleCancelAuction = useCallback((bids: Bid[]) => {
    console.log('Leilão cancelado/finalizado')

    clearInterval(shortTimer)
    clearInterval(longTimer)

    isResultModalVisible(true)
  }, [])

  const handleCounters = useCallback((object: {
    auction: Auction
    longCounter: number
    shortCounter: number
  }) => {
    const { longCounter, shortCounter } = object

    if (!auction) {
      return
    }

    setShortCounter(30 - shortCounter)
    setLongCounter(auction.timeout - longCounter)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!auction || !username) {
      return
    }

    const bid: Bid = {
      username,
      value: Number(bidMine),
      auctionId: auction?.id,
    }

    bids.push(bid)

    socket.emit(process.env.REACT_APP_SEND_NEW_BID_EVENT, bid)

    setBidMine('')
    setHigherValue((higherValue) => higherValue + 10)
    setShortCounter(30)
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    socket.emit(`${process.env.REACT_APP_GIMME_CURRENT_DATA_EVENT}`, null)
  }, [])

  const justOnce = useRef(false)

  useEffect(() => {
    if (!auction || justOnce.current) {
      return
    }

    justOnce.current = true

    setUpLongCounter(auction.timeout)
    setUpShortCounter(30)
  }, [auction])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`, handlePreviousBids)
    return () => {
      socket.off(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`)
    }
  }, [])

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
    socket.on(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`, handleCounters)
    return () => {
      socket.off(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`)
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

        <form style={{ flex: 1 }} onSubmit={handleSubmit}>
          <input
            id={styles.messageArea}
            placeholder="Pressione [Enter] para enviar o lance..."
            min={Math.floor(higherValue) + 10}
            type="number"
            value={bidMine}
            onChange={(e) => setBidMine(e.target.value)} />
        </form>
      </div>
    </>
  )
}

export default LiveAuction