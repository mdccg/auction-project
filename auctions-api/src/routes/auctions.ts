import { Router } from 'express'
import AuctionController from '../controllers/AuctionController'

export const auctionsRouter = Router()
const auctionController = new AuctionController()

auctionsRouter.get('/', async (req, res) => {
  const auctions = await auctionController.getAuctions()
  res.json({ auctions })
})

auctionsRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const auction = await auctionController.getAuctionById(id)

  if (!auction) {
    return res.status(404).json({ message: 'Não há nenhum leilão com este identificador.' })
  }

  res.json({ auction })
})