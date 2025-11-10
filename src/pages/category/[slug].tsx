import Layout from '@/components/Layout'
import ProductGrid from '@/components/ProductGrid'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CategoryPage() {
  const { query } = useRouter()
  const slug = String(query.slug || '')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState<[number, number]>([0, 10000])
  const { data } = useSWR(slug ? `/api/products?category=${slug}&brand=${brand}&minPrice=${price[0]}&maxPrice=${price[1]}` : null, fetcher)
  const products = data?.products || []

  return (
    <Layout title={slug.charAt(0).toUpperCase() + slug.slice(1)}>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 w-full border rounded-lg p-4 h-max">
          <h3 className="font-semibold mb-2">Filters</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1">Brand</label>
              <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Elite" className="w-full border rounded px-2 py-1 bg-transparent" />
            </div>
            <div>
              <label className="block mb-1">Max Price</label>
              <input type="number" value={price[1]} onChange={e => setPrice([0, Number(e.target.value || 0)])} className="w-full border rounded px-2 py-1 bg-transparent" />
            </div>
          </div>
        </aside>
        <section className="flex-1">
          <ProductGrid products={products} />
        </section>
      </div>
    </Layout>
  )
}
