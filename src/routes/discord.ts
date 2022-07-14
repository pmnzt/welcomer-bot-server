import express, { } from 'express' 
import { login, sendMessage,  } from './../controller/discordConroller'
const router = express.Router()

router.get('/login', login)
router.post('/send-message', sendMessage)
export default router