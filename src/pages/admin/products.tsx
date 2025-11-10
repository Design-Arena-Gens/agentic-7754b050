import Layout from '@/components/Layout'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminProducts() {
  const { data, mutate } = useSWR('/api/products', fetcher)
  const products = data?.products || []
  const [form, setForm] = useState({ name: '', brand: '', category: 'phones', price: 0, image: '', description: '', featured: false })

  async function createProduct() {
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { setForm({ name: '', brand: '', category: 'phones', price: 0, image: '', description: '', featured: false }); mutate() }
  }

  async function remove(id: string) {
    if (!confirm('Delete product?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <Layout title="Admin - Products">
      <h1 className="text-xl font-semibold mb-4">Products</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-3">Create Product</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="border rounded px-2 py-1 bg-transparent col-span-2" />
            <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})} className="border rounded px-2 py-1 bg-transparent" />
            <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="border rounded px-2 py-1 bg-transparent">
              <option value="phones">Phones</option>
              <option value="laptops">Laptops</option>
              <option value="accessories">Accessories</option>
              <option value="gadgets">Gadgets</option>
            </select>
            <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value||0)})} className="border rounded px-2 py-1 bg-transparent" />
            <input placeholder="Image URL" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} className="border rounded px-2 py-1 bg-transparent col-span-2" />
            <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="border rounded px-2 py-1 bg-transparent col-span-2" />
            <label className="col-span-2 inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form, featured:e.target.checked})} /> Featured</label>
            <button onClick={createProduct} className="bg-blue-600 text-white rounded px-3 py-1.5 col-span-2">Create</button>
          </div>
        </div>
        <div className="space-y-3">
          {products.map((p: any) => (
            <div key={p._id} className="border rounded p-3 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.image && <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />}
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.brand} ? ${p.price}</div>
              </div>
              <button onClick={()=>remove(p._id)} className="text-red-600">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
