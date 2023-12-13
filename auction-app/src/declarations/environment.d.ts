declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_SOCKET_SERVER_URL: string
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