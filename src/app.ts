import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'


dotenv.config()

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json({limit: "20kb"}))

app.get('/', (_req: any, res: any) => {
    res.status(200).json({ message: 'Server is running' })
})

export default app