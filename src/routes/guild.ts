import express, { Request, Response } from 'express'
import { addCharacter, setWebhookChannel } from '../controller/guild'

const router = express.Router()
router.post('/character', addCharacter)
router.post('/channel', setWebhookChannel)

export default router