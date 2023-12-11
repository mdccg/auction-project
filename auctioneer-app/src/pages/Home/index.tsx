import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useCallback, useContext, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { storage } from '../../config/firebase'
import { SocketContext } from '../../context/SocketContext'
import { Auction } from '../../models/Auction'
import styles from './styles.module.css'
import { useNavigate } from 'react-router-dom'

const predefinedValues = {
  title: 'Kinder Ovo',
  description: 'O mais caro do mercado!',
  initialBid: '10',
  minutes: '01',
  seconds: '00',
}

const Home = () => {
  // TODO remover valores prontos depois
  const [image, setImage] = useState<File | null>(null)
  const [title, setTitle] = useState<string>(predefinedValues.title)
  const [description, setDescription] = useState<string>(predefinedValues.description)
  const [initialBid, setInitialBid] = useState<string>(predefinedValues.initialBid)
  const [submitting, isSubmitting] = useState<boolean>(false)
  const [minutes, setMinutes] = useState<string>(predefinedValues.minutes)
  const [seconds, setSeconds] = useState<string>(predefinedValues.seconds)

  const { socket } = useContext(SocketContext)
  
  const navigate = useNavigate()

  const startAuction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    isSubmitting(true)

    // Envia a foto do produto para o Storage
    const uuid = crypto.randomUUID()
    const storageRef = ref(storage, `products/${uuid}`)
    const timeout = Number(minutes) * 60 + Number(seconds)

    try {
      await uploadBytes(storageRef, image as File)
      const imageURL = await getDownloadURL(storageRef)
      const auction: Auction = { id: uuid, imageURL, title, description, initialBid: Number(initialBid), timeout }

      navigate('/auction', { state: { auction } })
      socket.emit(`${process.env.REACT_APP_AUCTION_STARTED_EVENT}`, auction)
    
    } catch (err) {
      console.log(err)
      isSubmitting(false)
    }
  }

  const handleCurrentAuction = useCallback((auction: Auction) => {
    if (auction === null) {
      return
    }

    navigate('/auction', { state: { auction } })
  }, []);

  useEffect(() => {
    socket.on(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`, handleCurrentAuction)
    return () => {
      socket.off(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`)
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.auctionArea}>
        <form
          className={styles.auctionForm}
          onSubmit={(e) => startAuction(e)}>
          <div>
            <label>Escolha uma foto do produto</label>
            <input
              type="file"
              required
              placeholder='Escolha uma foto do produto'
              accept='image/png,image/jpeg'
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files[0])
                }
              }} />
          </div>

          {/* <div id={styles.uploadArea}>
            <span>Área de upload</span>
          </div> */}

          <div>
            <label>Título do produto</label>
            <input
              required
              type="text"
              value={title}
              placeholder='Título do produto'
              onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label>Descrição do produto</label>
            <textarea
              required
              placeholder='Descrição do produto'
              value={description}
              onChange={(e) => setDescription(e.target.value)}>
            </textarea>
          </div>

          <div>
            <label>Lance inicial (R$)</label>
            <input
              type="number"
              required
              placeholder='Lance inicial (R$)'
              min='1'
              step="0.01"
              value={initialBid}
              onChange={(e) => setInitialBid(e.target.value)} />
          </div>

          <div>
            <label>Duração máxima do leilão</label>
            <div id={styles.timeoutInput}>
              {/* A validação não é das melhores mas dá uma chance */}
              {/* https://as1.ftcdn.net/v2/jpg/04/13/72/48/1000_F_413724829_qBUoHlUPpE21OgKbKVzCht1SNeh5AhVr.jpg */}
              <input
                type="number"
                required
                placeholder="Minutos"
                min="0"
                max="59"
                step="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value.slice(0, 2))}
                onBlur={() => minutes ? setMinutes(`0${minutes}`.slice(-2)) : undefined} />
              <input
                type="number"
                required
                placeholder="Segundos"
                min="0"
                max="59"
                step="1"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value.slice(0, 2))}
                onBlur={() => seconds ? setSeconds(`0${seconds}`.slice(-2)) : undefined} />
            </div>
          </div>

          <div>
            <input type="submit" value="Simbora" disabled={submitting} />
          </div>
        </form>
      </div>

      <BeatLoader color='#555' loading={submitting} />
    </div>
  )
}

export default Home