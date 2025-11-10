import mongoose, { Schema, models, model } from 'mongoose'

export interface Product {
  _id: string
  name: string
  description: string
  brand: string
  category: 'phones' | 'laptops' | 'accessories' | 'gadgets' | string
  price: number
  image?: string
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

const ProductSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

export const ProductModel = models.Product || model<Product>('Product', ProductSchema)
