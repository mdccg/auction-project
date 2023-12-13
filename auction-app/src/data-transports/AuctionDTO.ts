type AuctionDTO = {
  id: string
  initialDate: string
  finalDate: string | null
  title: string
  description: string
  imageURL: string
  initialBid: number
  finalBid: number | null
  winner: string | null
  status: string
}

export default AuctionDTO