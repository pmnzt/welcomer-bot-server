import express, { Request, Response } from 'express'
import { port } from './config'
import cors from 'cors'
import { login, sendMessage, MessageObject, sendTyping, deleteMessage, editMessage } from './controller/discordConroller'
const app = express()
const server = app.listen(port, () => {
    console.log(`server running on ${port}`)
})
import { Server } from "socket.io"
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on('connection', (socket) => { 
    console.log('a user connected');
    socket.on('login', (msg) => {
        login(socket, msg)
    })

    socket.on('message', (msg) => {
        const channelId = msg.channelId
        const token = msg.token
        const message: MessageObject = msg.content
        sendMessage(socket, token, channelId, message)
    })

    socket.on('typing', (msg) => {
        const channelId = msg.channelId
        const token = msg.token
        
        sendTyping(socket, token, channelId)
        
    })

    socket.on('delete-message', (msg) => {
        const channel_id = msg.channelId
        const messsage_id = msg.messageId
        const token = msg.token

        deleteMessage(socket, token, channel_id, messsage_id)
    })

    socket.on('edit-message', (msg) => {
        const channel_id = msg.channelId
        const message_id = msg.messageId
        const message = msg.message
        const token = msg.token

        editMessage(socket, token, channel_id, message_id, message)

    })
});




app.use(function(req,res,next){
    (req as any).io = io;
    next();
});

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok'
    })
})

import discordRouter from './routes/discord'
import { Message } from 'eris'
app.use('/discord/', discordRouter)
