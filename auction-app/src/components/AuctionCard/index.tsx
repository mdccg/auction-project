import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuctionDTO from '../../data-transports/AuctionDTO'
import { Auction } from '../../models/Auction'
import styles from './styles.module.css'

type AuctionCardProps = {
  auction: AuctionDTO | Auction
  live?: boolean
  username: string
}

const AuctionCard: FC<AuctionCardProps> = ({ auction, live, username }) => {
  const navigate = useNavigate()

  const redirect = () => {
    if (!live) {
      return
    }

    navigate('/auction', { state: { auction, username } })
  }

  return (
    <div
      className={styles.auctionCard}
      onClick={redirect}
      style={{
        cursor: live ? 'pointer' : 'default',
        filter: live ? 'grayscale(0)' : 'grayscale(1)'
      }}
    >
      <img className={styles.productPhoto} src={auction.imageURL} alt={`Foto de ${auction.title}`} />
      
      <span className={styles.title}>{auction.title}</span>
      <span className={styles.text}>{auction.description}</span>
      <span className={styles.invite}>Clique para entrar</span>
    </div>
  )
}

export default AuctionCard