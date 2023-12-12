import 'reflect-metadata'
import { DataSource } from 'typeorm'
import Auction from './entity/Auction'

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: false,
    entities: [Auction],
    migrations: [],
    subscribers: [],
})
