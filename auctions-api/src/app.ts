import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import AuctionController from './controllers/AuctionController'
import { AppDataSource } from './data-source'
import { Auction } from './models/Auction'
import { Bid } from './models/Bid'
import { auctionsRouter } from './routes/auctions'

dotenv.config()

AppDataSource.initialize()

const app = express()

app.use(cors())
app.use('/auctions', auctionsRouter)

export const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      `${`${process.env.POPULATE_SCRIPT_URL}`}`,
      `${`${process.env.AUCTIONEER_APP_URL}`}`,
      `${`${process.env.AUCTIONS_APP_URL}`}`,
    ],
  },
})

const afk = 30

let bids: Bid[] = []
let currentAuction: Auction | null = null
let shortInterval: NodeJS.Timeout
let longInterval: NodeJS.Timeout
let shortCounter = 0
let longCounter = 0

const auctionController = new AuctionController()

const cancelAuction = async (id: string) => {
  await auctionController.finishAuction(id, bids)

  io.sockets.emit(`${process.env.REACT_APP_CANCEL_AUCTION_EVENT}`, bids)
  bids = []
  currentAuction = null
  clearInterval(shortInterval)
  clearInterval(longInterval)
  shortCounter = 0
  longCounter = 0
}

io.on('connection', (socket) => {
  console.log('Client connected')

  socket.emit(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`, { auction: currentAuction, longCounter, shortCounter })
  socket.emit(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`, bids)

  socket.on(`${process.env.REACT_APP_GIMME_CURRENT_DATA_EVENT}`, () => {
    socket.emit(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`, { auction: currentAuction, longCounter, shortCounter })
    socket.emit(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`, bids)
  });

  socket.on(`${process.env.REACT_APP_AUCTION_STARTED_EVENT}`, async (auction: Auction) => {
    currentAuction = auction

    await auctionController.registerAuction(auction)

    socket.broadcast.emit(`${process.env.REACT_APP_AUCTION_STARTED_EVENT}`, auction)

    console.log('O leilão começou.')

    shortInterval = setInterval(async () => {
      ++shortCounter
      
      if (shortCounter >= afk) {
        console.log('Leilão finalizado porque ninguém deu mais lances.')
        await cancelAuction(auction.id)
      }
    }, 1000)

    longInterval = setInterval(async () => {
      ++longCounter
      
      if (longCounter >= auction.timeout) {
        console.log('Leilão finalizado porque excedeu o tempo limite.')
        await cancelAuction(auction.id)
      }
    }, 1000)
  })

  socket.on(`${process.env.REACT_APP_SEND_NEW_BID_EVENT}`, (bid: Bid) => {
    if (currentAuction === null) {
      return
    }

    const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    console.log(`${bid.username} deu ${moneyFormatter.format(bid.value)}`)

    socket.broadcast.emit(`${process.env.REACT_APP_BID_RECEIVED_EVENT}`, bid)
    shortCounter = 0
    bids.push(bid)
  })
})