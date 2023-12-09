import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { Auction } from './models/Auction'
import { Bid } from './models/Bid'

dotenv.config()

const app = express()

let bids: Bid[] = []

export const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      `${process.env.POPULATE_SCRIPT_URL}`,
      `${process.env.AUCTIONEER_APP_URL}`,
      `${process.env.AUCTIONS_APP_URL}`,
    ],
  },
})

let currentAuction: Auction | null
let shortInterval: NodeJS.Timeout
let longInterval: NodeJS.Timeout
let afk = 30 * 1000

io.on('connection', (socket) => {
  console.log('Client connected')

  socket.emit('previousMessages', bids)
  socket.emit('currentAuction', currentAuction)

  socket.on('sendNewMessage', (bid: Bid) => {
    console.log('Novo lance: ', bid);
    bids.push(bid);

    clearInterval(shortInterval);

    shortInterval = setTimeout(() => {
      console.log('Leilão cancelado por falta de lances.');
      socket.emit('cancelAuction');
    }, afk);

    socket.broadcast.emit('messageReceived', bid)
  })

  socket.on('auctionStarted', (auction: Auction) => {
    currentAuction = auction
    console.log('Leilão iniciado: ', auction.title)

    io.sockets.emit('currentAuction', auction)
    io.sockets.emit('previousMessages', bids)
    
    shortInterval = setTimeout(() => {
      console.log('Leilão cancelado por falta de lances.');
      socket.emit('timeout');
    }, afk);

    longInterval = setTimeout(() => {
      console.log('Tempo limite do leilão atingido.');
      socket.emit('timeout');
    }, auction.timeout * 1000);
  })

  socket.on('cancelAuction', () => {
    clearInterval(shortInterval);
    clearInterval(longInterval);

    console.log('Redefinindo leilão...');

    bids = []
    currentAuction = null
    io.sockets.emit('currentAuction', null);
  })
})