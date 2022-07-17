import { Request, Response } from 'express'
import Eris, { Client, Guild } from 'eris'
import Api from './../libs/discordApi/disocrdApi'
import { Server, Socket } from "socket.io"

const readyBot = (bot: Client) => {
    console.log(`Ready! ${bot.guilds.size}`);
    
}

const initBotEvents = (bot: Client, socket: Socket) => {
    bot.on('ready', () => {
        readyBot(bot);

        const guilds: any = []

        bot.guilds.map((guild) => {
            guilds.push(guild.toJSON(['iconURL']))
        })

        socket.emit('guilds', JSON.stringify(
            guilds
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

type MessageObject = {
    content: string
}

const sendMessage = async (socket: Socket, token: string, channelId: string, message: MessageObject) => {
    const bot = new Api(token)
    const response = await bot.sendMessage(channelId, message)
    console.log(response)
    socket.emit('message-success', response)
}

const sendTyping = async (socket: Socket, token: string, channel_id: string) => {
    const bot = new Api(token)
    const response = await bot.sendTyping(channel_id) 
    
    socket.emit('typing-success', response)
}


export {
    login,
    sendMessage,
    MessageObject,
    sendTyping
}