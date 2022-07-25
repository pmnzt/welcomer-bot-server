import express, { Request, Response } from 'express'
import { addCharacter } from '../controller/guild'

const router = express.Router()
router.post('/character', addCharacter)

export default router