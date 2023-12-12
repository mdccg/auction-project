import { FC, useState } from 'react'
import AuctionDTO from '../../data-transports/AuctionDTO'
import styles from './styles.module.css'
import RedPulsingDot from '../../assets/images/red-pulsing-dot.gif'
import { useNavigate } from 'react-router-dom'
import { moneyFormatter } from '../../utils'

type AuctionCardProps = {
  auction: AuctionDTO
}

let size = 50

const AuctionCard: FC<AuctionCardProps> = ({ auction }) => {
  const navigate = useNavigate()

  const [description] = useState<string>(
    auction.description.length > size ? `${auction.description.slice(0, size)}...` : auction.description
  )
  const [status] = useState<string>(() => {
    switch (auction.status) {
      case 'STARTED':
        return 'Agora mesmo'
      
      case 'CANCELED':
        return 'Cancelado'
      
      case 'FINISHED':
        return 'Finalizado'

      default:
        return ''
    }
  })

  const redirect = () => {
    if (status !== 'Agora mesmo') {
      return
    }

    navigate('/auction', { state: { auction } })
  }

  return (
    <div className={styles.auctionCard} onClick={redirect} style={{ cursor: status === 'Agora mesmo' ? 'pointer' : 'default' }}>
      <img className={styles.productPhoto} src={auction.imageURL} alt={`Foto de ${auction.title}`} />
      
      <div className={styles.auctionInfo}>
        <span className={styles.title}>{auction.title}</span>
        <span className={styles.text}>{description}</span>
        
        <div>
          <span className={styles.text}>{status}</span>
          <img className={styles.redDot} src={RedPulsingDot} alt="Em live" style={{ visibility: status === 'Agora mesmo' ? 'visible' : 'hidden' }} />
        </div>

        {(auction.finalBid) && (
          <span className={styles.small}>Vendido por {moneyFormatter.format(auction.finalBid)}</span>
        )}
      </div>
    </div>
  )
}

export default AuctionCard