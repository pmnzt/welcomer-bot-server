import { Request, Response } from 'express'
import Eris, { Client } from 'eris'
import Api from './../libs/discordApi/disocrdApi'
 

const getBotGuilds = (bot: Client) => {
    return bot.guilds
}

const initBotEvents = (bot: Client) => {
    bot.on('ready', () => {
        console.log("Ready!");
    })

    bot.on('messageCreate', async (msg) => {
        console.log(msg)
    })
}

const newBot = (token: string) => {
    const bot: Client = new (Eris as any)(token);
    return bot
}

const login = async (req: Request, res: Response) => {
    const token: string = `${req.query.token}`

    const bot: Client = newBot(token)
    initBotEvents(bot)
    await bot.connect()
    const guilds = getBotGuilds(bot) 
    
    console.log(guilds.size)
    res.send(getBotGuilds(bot))
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