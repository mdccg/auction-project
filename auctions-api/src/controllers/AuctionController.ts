import { Repository } from 'typeorm'
import AuctionEntity from '../entity/Auction'
import { AppDataSource } from '../data-source'
import { Auction as AuctionModel } from '../models/Auction'
import { Bid } from '../models/Bid'
import AuctionStatus from '../enum/AuctionStatus'

class AuctionController {
  private _repo: Repository<AuctionEntity>

  constructor() {
    this._repo = AppDataSource.getRepository(AuctionEntity)
  }

  async registerAuction(auction: AuctionModel) {
    const { id, imageURL, title, description, initialBid } = auction;
    const initialDate = new Date();
    
    await this._repo.save({ id, initialDate, title, description, imageURL, initialBid });
  }

  async finishAuction(id: string, bids: Bid[]) {
    const finalDate = new Date()

    let finalBid: number
    let winner: string

    if (bids.length > 0) {
      const { username, value } = bids.pop()
      finalBid = value
      winner = username
    }

    const status = bids.length === 0 ? AuctionStatus.CANCELED : AuctionStatus.FINISHED

    await this._repo.update(id, { finalDate, finalBid, winner, status });
  }

  async getAuctions(): Promise<AuctionEntity[]> {
    return await this._repo.find({
      order: {
        finalDate: 'DESC'
      }
    })
  }

  async getAuctionById(id: string): Promise<AuctionEntity | null> {
    return await this._repo.findOne({ where: { id } })
  }
}

export default AuctionController