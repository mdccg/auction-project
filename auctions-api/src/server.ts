import { server } from './app'

const PORT = Number(process.env.PORT) || 3002

server.listen(PORT, () => console.log(`App running on port ${PORT}`))
