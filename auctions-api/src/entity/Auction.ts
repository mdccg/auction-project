import { Column, Entity, PrimaryColumn } from 'typeorm'
import AuctionStatus from '../enum/AuctionStatus'

@Entity()
class Auction {
  @PrimaryColumn()
  id: string

  @Column()
  initialDate: Date

  @Column({ nullable: true })
  finalDate: Date
  
  @Column()
  title: string
  
  @Column()
  description: string
  
  @Column()
  imageURL: string

  @Column()
  initialBid: number

  @Column({ nullable: true })
  finalBid: number

  @Column({ nullable: true })
  winner: string
  
  @Column({ default: AuctionStatus.STARTED })
  status: AuctionStatus
}

export default Auction