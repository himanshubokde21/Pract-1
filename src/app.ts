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

import userRouter from './routers/user.router.ts'
import videoRouter from './routers/video.router.ts'
import likeRouter from './routers/like.router.ts'
import commentRouter from './routers/comment.router.ts'
import subscriptionRouter from './routers/subscription.router.ts'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/videos',videoRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/subscription', subscriptionRouter)

export default app
