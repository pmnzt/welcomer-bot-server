import express, { } from 'express' 
import { login, sendMessage,  } from './../controller/discordConroller'
const router = express.Router()

router.post('/send-message', sendMessage)
export default router