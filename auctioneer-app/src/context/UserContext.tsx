import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { Bid } from '../models/Bid'

type UserContextType = {
  bids: Bid[]
  setBids: Dispatch<SetStateAction<UserContextType['bids']>>
}

const initialValue: UserContextType = {
  bids: [],
  setBids: () => {},
}

export const UserContext = createContext<UserContextType>(initialValue)

type UserContextProps = {
  children: ReactNode
}

export const UserContextProvider = ({ children }: UserContextProps) => {
  const [bids, setBids] = useState<UserContextType['bids']>(initialValue.bids)

  return (
    <UserContext.Provider value={{ bids, setBids }}>
      {children}
    </UserContext.Provider>
  )
}