import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json({limit: "20kb"}))

app.get('/', (_req: any, res: any) => {
    res.status(200).json({ message: 'Server is running' })
})

import UserRouter from './routers/user.router.ts'

app.use('/api/v1/users', UserRouter)

app.use((err: any, _req: any, res: any, _next: any) => {
	const statusCode = typeof err?.statusCode === 'number' ? err.statusCode : 500

	// Keep response simple for learning, but include DB code/message when present.
	const payload = {
		message: err?.message ?? 'Internal Server Error',
		errorCode: err?.code ?? null,
	}

	return res.status(statusCode).json(payload)
})

export default app
