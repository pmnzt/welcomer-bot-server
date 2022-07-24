import express, { Request, Response } from 'express'
import { port } from './config'
import cors from 'cors'
const app = express()

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