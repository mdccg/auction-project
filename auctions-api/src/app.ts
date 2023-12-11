import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { Auction } from './models/Auction'
import { Bid } from './models/Bid'

dotenv.config()

const app = express()

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

const cancelAuction = () => {
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

  socket.emit(`${process.env.REACT_APP_CURRENT_AUCTION_EVENT}`, currentAuction)
  socket.emit(`${process.env.REACT_APP_PREVIOUS_BIDS_EVENT}`, bids)
  socket.emit(`${process.env.REACT_APP_LONG_COUNTER_EVENT}`, longCounter)
  socket.emit(`${process.env.REACT_APP_SHORT_COUNTER_EVENT}`, shortCounter)

  socket.on(`${process.env.REACT_APP_AUCTION_STARTED_EVENT}`, (auction: Auction) => {
    currentAuction = auction

    socket.broadcast.emit(`${process.env.REACT_APP_AUCTION_STARTED_EVENT}`, auction)

    console.log('O leilão começou.')

    shortInterval = setInterval(() => {
      ++shortCounter
      
      if (shortCounter >= afk) {
        console.log('Leilão finalizado porque ninguém deu mais lances.')
        cancelAuction()
      }
    }, 1000)

    longInterval = setInterval(() => {
      ++longCounter
      
      if (longCounter >= auction.timeout) {
        console.log('Leilão finalizado porque excedeu o tempo limite.')
        cancelAuction()
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