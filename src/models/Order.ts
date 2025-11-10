import { Schema, model, models } from 'mongoose'

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface OrderDoc {
  _id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'paid' | 'failed'
  paymentProvider?: 'stripe' | 'mock'
  paymentIntentId?: string
  createdAt?: Date
  updatedAt?: Date
}

const OrderSchema = new Schema<OrderDoc>({
  userId: { type: String, required: true },
  items: { type: [{ productId: String, name: String, price: Number, quantity: Number, image: String }], required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentProvider: { type: String },
  paymentIntentId: { type: String },
}, { timestamps: true })

export const OrderModel = models.Order || model<OrderDoc>('Order', OrderSchema)
