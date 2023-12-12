import axios, { AxiosInstance, AxiosResponse } from 'axios'
import AuctionDTO from '../data-transports/AuctionDTO'

class AuctionService {
  private _http: AxiosInstance

  constructor() {
    this._http = axios.create({
      baseURL: process.env.REACT_APP_SOCKET_SERVER_URL
    })
  }

  async getAuctions() {
    const response: AxiosResponse<{ auctions: AuctionDTO[] }> = await this._http.get('/auctions')
    return response.data.auctions.filter(({ status }) => status !== 'STARTED')
  }
}

export default AuctionService