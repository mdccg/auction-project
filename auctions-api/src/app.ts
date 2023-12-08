import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import dotenv from 'dotenv'
import { Auction } from './models/Auction'
import { Bid } from './models/Bid'

dotenv.config()

const app = express()

let messages: Bid[] = []

export const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      `${process.env.AUCTIONEER_APP_URL}`,
      `${process.env.AUCTIONS_APP_URL}`,
    ],
  },
})

let currentAuction: Auction | null
let interval: any

io.on('connection', (socket) => {
  console.log('Client connected')

  socket.emit('previousMessages', messages)
  socket.emit('currentAuction', currentAuction)

  socket.on('sendNewMessage', (messageObj: Bid) => {
    console.log(messageObj)
    messages.push(messageObj)
    socket.broadcast.emit('messageReceived', messageObj)
  })

  socket.on('auctionStarted', (messageObj: Auction) => {
    currentAuction = messageObj

    console.log(messageObj)
    socket.emit('currentAuction', messageObj)
    socket.emit('previousMessages', messages)

    /**
     * O bloco a seguir serve apenas para testar
     * a tela de acompanhamento do leilão ao vivo.
     * Remover depois.
     */
    const names = ['Fulano', 'Beltrano', 'Ciclano']
    let bidValue = 510
    interval = setInterval(() => {
      const username = names[Math.floor(Math.random() * names.length)]

      const bid: Bid = {
        auctionId: messageObj.id,
        username,
        value: bidValue,
      }

      messages.push(bid)

      console.log(`${username} acabou de dar ${bidValue.toLocaleString()}`)

      bidValue += 50

      socket.emit('messageReceived', bid)
    }, 5000)
  })

  socket.on('cancelAuction', () => {
    clearInterval(interval)

    // TODO
    // Consumir endpoints aqui para salvar bids no banco
    console.log(messages)

    messages = []
    currentAuction = null

    socket.emit('currentAuction', null)
  })
})
