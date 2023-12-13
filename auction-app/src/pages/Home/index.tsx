import { useCallback, useContext, useEffect, useState } from 'react'
import AuctionCard from '../../components/AuctionCard'
import { SocketContext } from '../../context/SocketContext'
import { Auction } from '../../models/Auction'
import { Bid } from '../../models/Bid'
import styles from './styles.module.css'
import { moneyFormatter } from '../../utils'

const Home = () => {
  const { socket } = useContext(SocketContext)
  
  const [currentAuction, setCurrentAuction] = useState<Auction | undefined>()

  const [higherValue, setHigherValue] = useState<number | undefined>()
  const [username, setUsername] = useState<string>('')

  const handleCurrentAuction = useCallback((object: {
    auction: Auction
    longCounter: number
    shortCounter: number
  }) => {
    if (object.auction === null) {
      return
    }

    setCurrentAuction(object.auction)
  }, [])

  const handlePreviousBids = useCallback((bids: Bid[]) => {
    const lastBid = bids.pop()

    if (!lastBid) {
      return
    }

    const { value } = lastBid
    setHigherValue(value)
  }, [])

  const handleCancelAuction = useCallback((bids: Bid[]) => {
    setCurrentAuction(undefined)
  }, [])

  const handleStartedAuction = useCallback((auction: Auction) => {
    socket.emit(process.env.REACT_APP_GIMME_CURRENT_DATA_EVENT, null)
  }, [])

  const handleBidReceived = useCallback((bid: Bid) => {
    const { value } = bid
    setHigherValue(value)
  }, [])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`, handleCurrentAuction)
    return () => {
      socket.off(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`)
    }
  }, [])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`, handlePreviousBids)
    return () => {
      socket.off(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`)
    }
  }, [])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_CANCEL_AUCTION_EVENT}`, handleCancelAuction)
    return () => {
      socket.off(`${process.env.REACT_APP_CANCEL_AUCTION_EVENT}`)
    }
  }, [])
  
  useEffect(() => {
    socket.on(`${process.env.REACT_APP_AUCTION_STARTED_EVENT}`, handleStartedAuction)
    return () => {
      socket.off(`${process.env.REACT_APP_AUCTION_STARTED_EVENT}`)
    }
  }, [])

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_BID_RECEIVED_EVENT}`, handleBidReceived)
    return () => {
      socket.off(`${process.env.REACT_APP_BID_RECEIVED_EVENT}`)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.blankSpace}>&nbsp;</div>
      
      {(currentAuction) ? (
        <div id={styles.auctionList}>
          {(currentAuction) && (
            <AuctionCard
              auction={currentAuction}
              live={username.trim().length > 0}
              username={username}
            />
          )}
          {(higherValue) && (
            <div className={styles.higherValueBox}>
              <span className={styles.higherValue}>
                Maior lance: {moneyFormatter.format(higherValue)}
              </span>
            </div>
          )}
          <input
            className={styles.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Seu nome de usuário"
          />
        </div>
      ) : (
        <div id={styles.notFound}>
          <span>Nenhum leilão está acontecendo nesse momento...</span>
          <span>Quem sabe outra hora?</span>
        </div>
      )}

      <div className={styles.blankSpace}>&nbsp;</div>
    </div>
  )
}

export default Home