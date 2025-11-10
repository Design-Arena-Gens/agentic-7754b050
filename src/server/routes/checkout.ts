import { Router } from 'express'
import { getStripe } from '@/lib/stripe'
import { connectDb, isDbConnected } from '@/lib/db'
import { OrderModel } from '@/models/Order'
import { AuthedRequest, requireAuth } from '@/server/middleware/auth'
import { createMemoryOrder } from './orders'

export const checkoutRouter = Router()

checkoutRouter.post('/create', requireAuth, async (req: AuthedRequest, res) => {
  const { items } = req.body as { items: Array<{ productId: string, name: string, price: number, quantity: number, image?: string }> }
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' })
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  const stripe = getStripe()
  if (!stripe) {
    // Simulated success order when Stripe not configured
    await connectDb()
    if (isDbConnected()) {
      const order = await OrderModel.create({ userId: req.user!.userId, items, total, status: 'paid', paymentProvider: 'mock' })
      return res.json({ simulated: true, ok: true, orderId: String(order._id) })
    }
    const order = createMemoryOrder({ userId: req.user!.userId, items, total, status: 'paid', paymentProvider: 'mock' })
    return res.json({ simulated: true, ok: true, orderId: order._id })
  }

  // Use PaymentIntent simple flow
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'usd',
    metadata: { userId: req.user!.userId }
  })

  await connectDb()
  if (isDbConnected()) {
    await OrderModel.create({ userId: req.user!.userId, items, total, status: 'pending', paymentProvider: 'stripe', paymentIntentId: paymentIntent.id })
  }
  res.json({ clientSecret: paymentIntent.client_secret })
})
