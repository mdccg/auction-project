import { Navigate, useLocation } from 'react-router-dom'
import { Auction } from '../../models/Auction'
import styles from './styles.module.css'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Bid } from '../../models/Bid'
import BidCard from '../../components/BidCard'
import { SocketContext } from '../../context/SocketContext'

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

  const handleCancelAuction = () => {
    socket.emit(`${process.env.REACT_APP_CANCEL_AUCTION_EVENT}`)
  }

  const handlePreviousMessages = useCallback((messageObj: Bid[]) => {
    console.log('Previous messages')
    console.log(messageObj)

    setBids(messageObj)
  }, [bids])

  const handleMessageReceived = useCallback((messageObj: Bid) => {
    console.log('Message received')
    console.log(messageObj)

    const updatedBids = [...bids, messageObj]
    setBids(updatedBids)
  }, [bids])

  socket.once(`${process.env.REACT_APP_PREVIOUS_MESSAGES_EVENT}`, handlePreviousMessages)
  socket.on(`${process.env.REACT_APP_MESSAGE_RECEIVED_EVENT}`, handleMessageReceived)

  useEffect(() => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bids])

  if (!location.state || !socket.connected) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={styles.container}>
      {(auction) && <h1 className={styles.auctionTitle}>Leilão ao vivo do item "{auction.title}"</h1>}

      <div id='scroll-area' className={styles.liveAuctionArea}>
        {bids.map((b, index) => <BidCard key={index} bid={b} />)}

        <div ref={bottomEl}></div>
      </div>

      <div className={styles.cancelAuctionButton} onClick={handleCancelAuction}>
        <span>Finalizar leilão</span>
      </div>
    </div>
  )
}

export default LiveAuction