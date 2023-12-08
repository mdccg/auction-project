import { useNavigate, useRoutes } from 'react-router-dom'
import { useCallback, useContext } from 'react'
import { SocketContext } from './context/SocketContext'
import { Auction } from './models/Auction'
import routes from './routes'

const App = () => {
  const elements = useRoutes(routes)
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()

  const handleCurrentAuction = useCallback((auction: Auction | null) => {
    const running = auction !== null

    if (running) {
      navigate('/auction', { state: { auction } })

    } else {
      navigate('/')
    }
  }, [])

  socket.on(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`, handleCurrentAuction)

  return elements
}

export default App