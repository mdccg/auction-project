import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RedPulsingDot from '../../assets/images/red-pulsing-dot.svg'
import AuctionDTO from '../../data-transports/AuctionDTO'
import { Auction } from '../../models/Auction'
import { moneyFormatter } from '../../utils'
import styles from './styles.module.css'

type AuctionCardProps = {
  auction: AuctionDTO | Auction
  live?: boolean
}

let size = 50

const isDTO = (object: any): object is AuctionDTO => object.status !== undefined && object.finalBid !== undefined

const AuctionCard: FC<AuctionCardProps> = ({ auction, live }) => {
  const navigate = useNavigate()

  const dto = isDTO(auction)

  const [description] = useState<string>(
    auction.description.length > size ? `${auction.description.slice(0, size)}...` : auction.description
  )
  const [status] = useState<string>(() => {
    if (!dto) {
      return ''
    }

    switch (auction.status) {
      case 'CANCELED':
        return 'Cancelado'
      
      case 'FINISHED':
        return 'Finalizado'

      default:
        return ''
    }
  })

  const redirect = () => {
    if (!live) {
      return
    }

    navigate('/auction', { state: { auction } })
  }

  useEffect(() => {
  }, [])

  return (
    <div className={styles.auctionCard} onClick={redirect} style={{ cursor: live ? 'pointer' : 'default' }}>
      <img className={styles.productPhoto} src={auction.imageURL} alt={`Foto de ${auction.title}`} />
      
      <div className={styles.auctionInfo}>
        <span className={styles.title}>{auction.title}</span>
        <span className={styles.text}>{description}</span>
        
        <div className={styles.redDotContainer}>
          <span className={styles.text}>{live ? 'Agora mesmo' : status}</span>
          <img className={styles.redDot} src={RedPulsingDot} alt="Em live" style={{ visibility: live ? 'visible' : 'hidden' }} />
        </div>

        {(dto && auction.finalBid) && (
          <span className={styles.small}>Vendido por {moneyFormatter.format(auction.finalBid)}</span>
        )}
      </div>
    </div>
  )
}

export default AuctionCard