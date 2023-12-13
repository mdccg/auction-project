import { Bid } from '../../models/Bid'
import { moneyFormatter } from '../../utils'
import styles from './styles.module.css'

type Props = {
  bid: Bid
}

const BidCard = ({ bid }: Props) => {
  return (
    <div className={styles.card}>
      <span className={styles.username}>{bid.username}:</span>
      <span className={styles.bid}>{moneyFormatter.format(bid.value)}</span>
    </div>
  )
}

export default BidCard