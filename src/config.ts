import * as dotenv from "dotenv"
dotenv.config()

const port = 4000
const token = process.env.BOT_TOKEN ?? 'no token'
const dbURI = process.env.MONGO_URI ?? ''
const embedsColor = 15548997

export {
    port,
    token,
    dbURI,
    embedsColor
}