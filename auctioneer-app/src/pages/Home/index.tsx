import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useContext, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { storage } from '../../config/firebase'
import { SocketContext } from '../../context/SocketContext'
import { Auction } from '../../models/Auction'
import styles from './styles.module.css'

const Home = () => {
  const [image, setImage] = useState<File | null>(null)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [initialBid, setInitialBid] = useState<number>(1)
  const [submitting, isSubmitting] = useState<boolean>(false)
  const [minutes, setMinutes] = useState<string>('')
  const [seconds, setSeconds] = useState<string>('')

  const { socket } = useContext(SocketContext)
  
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
      const auction: Auction = { id: uuid, imageURL, title, description, initialBid, timeout }

      socket.emit(`${process.env.REACT_APP_AUCTION_STARTED_EVENT}`, auction)
    } catch (err) {
      console.log(err)
      isSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.auctionArea}>
        <form
          className={styles.auctionForm}
          onSubmit={(e) => startAuction(e)}>
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

          <label>Título do produto</label>
          <input
            required
            type="text"
            value={title}
            placeholder='Título do produto'
            onChange={(e) => setTitle(e.target.value)} />

          <label>Descrição do produto</label>
          <textarea
            required
            placeholder='Descrição do produto'
            value={description}
            onChange={(e) => setDescription(e.target.value)}>
          </textarea>

          <label>Lance inicial (R$)</label>
          <input
            type="number"
            required
            placeholder='Lance inicial (R$)'
            min='1'
            step="0.01"
            value={initialBid}
            onChange={(e) => setInitialBid(+e.target.value)} />

          <label>Duração máxima do leilão</label>
          <div id={styles.timeoutInput}>
            {/* A validação não é das melhores mas dá uma chance */}
            {/* https://as1.ftcdn.net/v2/jpg/04/13/72/48/1000_F_413724829_qBUoHlUPpE21OgKbKVzCht1SNeh5AhVr.jpg */}
            <input type="number" required placeholder='00' min='0' max="59" step="1" value={minutes} onChange={(e) => setMinutes(e.target.value.slice(0, 2))} />
            <input type="number" required placeholder='00' min='0' max="59" step="1" value={seconds} onChange={(e) => setSeconds(e.target.value.slice(0, 2))} />
          </div>

          <input type="submit" value="Iniciar" />
        </form>
      </div>

      <BeatLoader color='#555' loading={submitting} />
    </div>
  )
}

export default Home