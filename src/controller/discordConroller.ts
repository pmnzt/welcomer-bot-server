import { Request, Response } from 'express'
import Eris, { Client } from 'eris'
import Api from './../libs/discordApi/disocrdApi'
import { Server, Socket } from "socket.io"

const readyBot = (bot: Client) => {
    console.log(`Ready! ${bot.guilds.size}`);
    
}

const initBotEvents = (bot: Client, socket: Socket) => {
    bot.on('ready', () => {
        readyBot(bot);

        socket.emit('guilds', JSON.stringify(
            bot.guilds
        ))
    })

    bot.on('messageCreate', async (msg) => {
        console.log(msg)
    })

    bot.on('error', (err, shardID) => {
        console.log(err)
    })
}

const newBot = (token: string) => {
    const bot: Client = new (Eris as any)(token);
    return bot
}

type LoginObject = {
    token: string
}

const login = async (socket: Socket, msg: LoginObject) => {
    const bot: Client = newBot(msg.token)
    initBotEvents(bot, socket)
    await bot.connect(); 
}

const sendMessage = async (req: Request, res: Response) => {
    const token: string = req.headers['authorization'] || ''
    const channel_id: string = `${req.query.channel_id}`
    const messageData = req.body
     
    const bot = new Api(token)
    res.json(await bot.sendMessage(channel_id, messageData))
}


export {
    login,
    sendMessage
}