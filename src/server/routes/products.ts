import { Router } from 'express'
import { connectDb, isDbConnected } from '@/lib/db'
import { ProductModel } from '@/models/Product'

const memoryProducts: any[] = [
  { _id: 'p1', name: 'Elite Phone X', brand: 'Elite', category: 'phones', price: 999, description: 'Flagship smartphone', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop', featured: true },
  { _id: 'p2', name: 'Elite Laptop Pro', brand: 'Elite', category: 'laptops', price: 1799, description: 'Powerful laptop', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop', featured: true },
  { _id: 'p3', name: 'Wireless Earbuds', brand: 'Sonic', category: 'accessories', price: 149, description: 'Noise-cancelling earbuds', image: 'https://images.unsplash.com/photo-1585386959984-a41552231615?q=80&w=1200&auto=format&fit=crop', featured: false },
  { _id: 'p4', name: 'Action Camera', brand: 'Vista', category: 'gadgets', price: 299, description: '4K action cam', image: 'https://images.unsplash.com/photo-1518675219903-c682c4bd39e4?q=80&w=1200&auto=format&fit=crop', featured: false }
]

export const productsRouter = Router()

productsRouter.get('/', async (req, res) => {
  const { category, brand, minPrice, maxPrice, featured, q } = req.query as Record<string, string>
  await connectDb()
  let products: any[]
  if (isDbConnected()) {
    const filter: any = {}
    if (category) filter.category = category
    if (brand) filter.brand = brand
    if (featured) filter.featured = featured === '1'
    if (q) filter.name = { $regex: q, $options: 'i' }
    if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) }
    products = await ProductModel.find(filter).lean()
  } else {
    products = memoryProducts.filter(p => (
      (!category || p.category === category) &&
      (!brand || p.brand === brand) &&
      (!featured || p.featured === (featured === '1')) &&
      (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
      (!minPrice || p.price >= Number(minPrice)) &&
      (!maxPrice || p.price <= Number(maxPrice))
    ))
  }
  res.json({ products })
})

productsRouter.get('/featured', async (_req, res) => {
  await connectDb()
  let products: any[]
  if (isDbConnected()) products = await ProductModel.find({ featured: true }).lean()
  else products = memoryProducts.filter(p => p.featured)
  res.json({ products })
})

productsRouter.get('/:id', async (req, res) => {
  await connectDb()
  const id = req.params.id
  if (isDbConnected()) {
    const product = await ProductModel.findById(id).lean()
    if (!product) return res.status(404).json({ error: 'Not found' })
    return res.json({ product })
  }
  const product = memoryProducts.find(p => p._id === id)
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json({ product })
})

// Admin create/update/delete (simple; auth in admin router uses middleware normally)
productsRouter.post('/', async (req, res) => {
  await connectDb()
  const body = req.body
  if (isDbConnected()) {
    const created = await ProductModel.create(body)
    return res.status(201).json({ product: created })
  }
  const newProd = { ...body, _id: `p${Date.now()}` }
  memoryProducts.push(newProd)
  res.status(201).json({ product: newProd })
})

productsRouter.put('/:id', async (req, res) => {
  await connectDb()
  const id = req.params.id
  if (isDbConnected()) {
    const updated = await ProductModel.findByIdAndUpdate(id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Not found' })
    return res.json({ product: updated })
  }
  const idx = memoryProducts.findIndex(p => p._id === id)
  if (idx < 0) return res.status(404).json({ error: 'Not found' })
  memoryProducts[idx] = { ...memoryProducts[idx], ...req.body }
  res.json({ product: memoryProducts[idx] })
})

productsRouter.delete('/:id', async (req, res) => {
  await connectDb()
  const id = req.params.id
  if (isDbConnected()) {
    const deleted = await ProductModel.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Not found' })
    return res.json({ ok: true })
  }
  const idx = memoryProducts.findIndex(p => p._id === id)
  if (idx < 0) return res.status(404).json({ error: 'Not found' })
  memoryProducts.splice(idx, 1)
  res.json({ ok: true })
})
