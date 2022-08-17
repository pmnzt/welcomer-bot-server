import * as dotenv from "dotenv"
dotenv.config()

const port = process.env.PORT ?? 5000
const token = process.env.BOT_TOKEN ?? 'no token'
const dbURI = process.env.MONGO_URI ?? ''
const embedsColor = 15105570

export {
    port,
    token,
    dbURI,
    embedsColor
}