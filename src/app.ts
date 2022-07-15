import express, { Request, Response } from 'express'
import { port } from './config'
import cors from 'cors'
import { login } from './controller/discordConroller'
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
app.use('/discord/', discordRouter)
