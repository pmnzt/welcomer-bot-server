import express, { Request, Response } from 'express'
import { port, token } from './config'
import cors from 'cors'
const app = express()

import Eris, { Client } from 'eris'
const bot: Client = new (Eris as any)(token, {
    intents: 32767
})

bot.on('ready', () => {
    console.log(`${bot.user.username} is ready!`)
})

bot.on('messageCreate', (message) => {
    if(message.content === '!test') {
        bot.createMessage(message.channel.id, 'Hello babe!')
    }
})

bot.connect()

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok'
    })
})


app.listen(port, () => {
    console.log(`server running on ${port}`)
})