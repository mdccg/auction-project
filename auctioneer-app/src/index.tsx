import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SocketContextProvider } from './context/SocketContext'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { UserContextProvider } from './context/UserContext'

const rootHTMLElement = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootHTMLElement)
root.render(
  <UserContextProvider>
    <SocketContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketContextProvider>
  </UserContextProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
