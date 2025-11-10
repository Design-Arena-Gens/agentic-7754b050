import { Router } from 'express'
import { connectDb, isDbConnected } from '@/lib/db'
import { OrderModel } from '@/models/Order'
import { requireAuth, AuthedRequest } from '@/server/middleware/auth'

const memoryOrders: any[] = []

export const ordersRouter = Router()

ordersRouter.get('/mine', requireAuth, async (req: AuthedRequest, res) => {
  await connectDb()
  if (isDbConnected()) {
    const orders = await OrderModel.find({ userId: req.user!.userId }).sort({ createdAt: -1 }).lean()
    return res.json({ orders })
  }
  const orders = memoryOrders.filter(o => o.userId === req.user!.userId)
  res.json({ orders })
})

ordersRouter.get('/:id', requireAuth, async (req: AuthedRequest, res) => {
  await connectDb()
  const id = req.params.id
  if (isDbConnected()) {
    const order = await OrderModel.findById(id).lean() as any
    if (!order || order.userId !== req.user!.userId) return res.status(404).json({ error: 'Not found' })
    return res.json({ order })
  }
  const order = memoryOrders.find(o => o._id === id && o.userId === req.user!.userId)
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json({ order })
})

export function createMemoryOrder(data: any) {
  const id = `o${Date.now()}`
  const order = { _id: id, ...data, createdAt: new Date(), updatedAt: new Date() }
  memoryOrders.push(order)
  return order
}
