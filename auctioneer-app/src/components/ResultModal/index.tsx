import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Auctioneer from '../../assets/images/auctioneer.svg'
import Buyer from '../../assets/images/buyer.svg'
import { Auction } from '../../models/Auction'
import { Bid } from '../../models/Bid'
import { moneyFormatter } from '../../utils'
import styles from './styles.module.css'
import { useNavigate } from 'react-router-dom'

type ResultModalProps = {
  visible: boolean
  auction: Auction
  longCounter: number
  bids: Bid[]
}

const ResultModal: FC<ResultModalProps> = ({ visible, auction, longCounter, bids }) => {
  const navigate = useNavigate()
  
  const [duration, setDuration] = useState<string>('')
  const [bidsCount, setBidsCount] = useState<number | undefined>()
  const today = new Date().toLocaleDateString()

  const [winner, setWinner] = useState<Bid | null | undefined>()
  const hasWinner = winner !== null

  const hideModal = () => navigate('/')

  useEffect(() => {
    const getWinner = () => {
      if (bids.length === 0) {
        setWinner(null)
        return
      }

      const winner = [...bids].pop()
      setWinner(winner)
    }

    const getDuration = () => {
      const minutes = Math.floor(longCounter / 60)
      const seconds = longCounter % 60
      const minuteUnit = minutes === 0 ? '' : minutes === 1 ? 'minuto' : 'minutos'
      const secondUnit = seconds === 0 ? '' : seconds === 1 ? 'segundo' : 'segundos'
      const duration = [{ value: minutes, unit: minuteUnit }, { value: seconds, unit: secondUnit }]
        .filter(({ unit }) => Boolean(unit))
        .map(({ value, unit }) => `${value} ${unit}`)
        .join(' e ')

      setDuration(duration)
    }

    const getBidsCount = () => {
      if (bids.length < 3) {
        return
      }

      setBidsCount(bids.length - 1)
    }

    getWinner()
    getDuration()
    getBidsCount()
  }, [longCounter, bids])

  if (!visible || winner === undefined) {
    return <></>
  }

  return (
    <div id={styles.resultModalWrapper}>
      <img id={styles.resultIcon} src={(!hasWinner) ? Auctioneer : Buyer} alt={(!hasWinner) ? 'A figura de um leiloeiro batendo seu martelo' : 'A figura de um participante do leilão levantando seu lance'} />
      
      <div id={styles.resultModal}>
        {(hasWinner) ? (
          <>
            <span className={styles.heading}>Parabéns, {winner.username}!</span>
            <span className={styles.description}>
              {winner.username} foi o(a) ganhador(a) do produto <b>{auction.title}</b>, valendo
              inicialmente {moneyFormatter.format(auction.initialBid)} e vendido
              por {moneyFormatter.format(winner.value)}.
              Este leilão durou {duration}.
              {(bidsCount) && (
                <>
                  &nbsp;Além disso, antes de finalmente
                  conseguir o produto {auction.title}, {winner.username} enfrentou
                  impressionantes {bidsCount} lances de concorrentes.
                  Que produto disputado, hein?
                </>
              )}
            </span>
          </>
        ) : (
          <>
            <span className={styles.heading}>Leilão cancelado!</span>
            <span className={styles.description}>
              Prezados interessados,<br />
              <br />
              Informamos que o leilão do produto {auction.title}, marcado
              para o dia {today}, foi cancelado por falta de lances. Pedimos desculpas pelo
              inconveniente e nos colocamos à disposição para maiores esclarecimentos.<br />
              <br />
              Atenciosamente,<br />
              seu querido leiloeiro.
            </span>
          </>
        )}

        <div id={styles.closeModalButton} onClick={hideModal}>
          <span>Vida que segue</span>
        </div>
      </div>
    </div>
  )
}

export default ResultModal