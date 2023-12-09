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
      `${process.env.POPULATE_SCRIPT_URL}`,
      `${process.env.AUCTIONEER_APP_URL}`,
      `${process.env.AUCTIONS_APP_URL}`,
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
let timeout = false

io.on('connection', (socket) => {
  console.log('Client connected')

  socket.emit('currentAuction', currentAuction)
  socket.emit('previousMessages', bids)
  socket.emit('shortCounter', shortCounter)
  socket.emit('longCounter', longCounter)
  socket.emit('timeout', timeout)

  socket.on('sendNewMessage', (bid: Bid) => {
    console.log('Novo lance: ', bid)
    
    bids.push(bid)
    shortCounter = 0
    
    socket.broadcast.emit('messageReceived', bid)
    socket.broadcast.emit('shortCounter', afk)
  })

  socket.on('auctionStarted', (auction: Auction) => {
    currentAuction = auction
    console.log('Leilão iniciado: ', auction.title)

    io.sockets.emit('currentAuction', auction)
    io.sockets.emit('previousMessages', bids)
    io.sockets.emit('shortCounter', shortCounter)
    io.sockets.emit('longCounter', longCounter)

    shortInterval = setInterval(() => {
      shortCounter += 1
      
      if (shortCounter >= afk * 1000) {
        console.log('Leilão cancelado por falta de lances.')
        timeout = true
        socket.emit('timeout', timeout)
      }
    }, 1000)

    longInterval = setInterval(() => {
      longCounter += 1
      
      if (longCounter >= auction.timeout) {
        console.log('Tempo limite do leilão atingido.')
        timeout = true
        socket.emit('timeout', timeout)
      }
    }, 1000)
  })

  socket.on('cancelAuction', () => {
    bids = []
    currentAuction = null
    clearInterval(shortInterval)
    clearInterval(longInterval)
    shortCounter = 0
    longCounter = 0
    timeout = false

    console.log('Leilão finalizado.')

    io.sockets.emit('currentAuction', null)
  })
})