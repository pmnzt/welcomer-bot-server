import express, { Request, Response } from 'express'
import { port } from './config'
const app = express()

app.use(express.json())
app.get('/', (req, res) => {
    res.sendStatus(200)
})

import discordRouter from './routes/discord'
app.use('/discord/', discordRouter)


app.listen(port, () => {
    console.log(`server running on ${port}`)
})