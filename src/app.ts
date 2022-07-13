import express, { Request, Response } from 'express'
import { port } from './config'
const app = express()

app.get('/', (req, res) => {
    console.log('hi')
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`server running on ${port}`)
})