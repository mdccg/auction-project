declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POPULATE_SCRIPT_URL: string
      AUCTIONEER_APP_URL: string
      AUCTIONS_APP_URL: string
      PORT: string
      REACT_APP_CURRENT_AUCTION_EVENT: string
      REACT_APP_PREVIOUS_BIDS_EVENT: string
      REACT_APP_SEND_NEW_BID_EVENT: string
      REACT_APP_BID_RECEIVED_EVENT: string
      REACT_APP_AUCTION_STARTED_EVENT: string
      REACT_APP_CANCEL_AUCTION_EVENT: string
      REACT_APP_GIMME_CURRENT_DATA_EVENT: string
    }
  }
}

export {}