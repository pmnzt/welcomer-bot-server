import { Request, Response } from 'express'

const login = (req: Request, res: Response) => {
    const token = req.query.token
    res.send(token)
}


export {
    login
}