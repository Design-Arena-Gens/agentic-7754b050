import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { productsRouter } from './routes/products'
import { authRouter } from './routes/auth'
import { ordersRouter } from './routes/orders'
import { checkoutRouter } from './routes/checkout'

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))

app.get('/api/health', (_, res) => res.json({ ok: true, name: 'Elite Electronics API' }))

app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/checkout', checkoutRouter)

export default function handler(req: any, res: any) {
  // Let express handle the request
  // @ts-ignore
  return app(req, res)
}
