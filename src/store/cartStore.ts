import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/models/Product'

export type CartItem = {
  productId: string
  name: string
  price: number
  image?: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  add: (p: { product: Product, quantity?: number }) => void
  remove: (productId: string) => void
  changeQty: (productId: string, qty: number) => void
  clear: () => void
  totalQuantity: number
  totalPrice: number
}

export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [],
  add: ({ product, quantity = 1 }) => {
    const items = [...get().items]
    const idx = items.findIndex(i => i.productId === String(product._id))
    if (idx >= 0) items[idx].quantity += quantity
    else items.push({ productId: String(product._id), name: product.name, price: product.price, image: product.image, quantity })
    set({ items })
  },
  remove: (productId) => set({ items: get().items.filter(i => i.productId !== productId) }),
  changeQty: (productId, qty) => set({ items: get().items.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i) }),
  clear: () => set({ items: [] }),
  get totalQuantity() { return get().items.reduce((s, i) => s + i.quantity, 0) },
  get totalPrice() { return get().items.reduce((s, i) => s + i.quantity * i.price, 0) },
}), { name: 'ee-cart' }))
