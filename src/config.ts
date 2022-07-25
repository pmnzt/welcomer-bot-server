import * as dotenv from "dotenv"
dotenv.config()

const port = 4000
const token = process.env.BOT_TOKEN ?? 'no token'
export {
    port,
    token
}