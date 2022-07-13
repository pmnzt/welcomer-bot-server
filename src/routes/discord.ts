import express, { } from 'express'
import { login } from './../controller/discordConroller'
const router = express.Router()

router.get('/login', login)

export default router