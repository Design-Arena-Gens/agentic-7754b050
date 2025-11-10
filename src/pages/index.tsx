import Layout from '@/components/Layout'
import ProductGrid from '@/components/ProductGrid'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Home() {
  const { data } = useSWR('/api/products/featured', fetcher)
  const { data: promos } = useSWR('/api/products?featured=1', fetcher)
  const products = data?.products || promos?.products || []

  return (
    <Layout>
      <section className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">Elite Electronics</h1>
        <p className="text-sm opacity-90">Premium phones, laptops, accessories, and gadgets</p>
      </section>
      <h2 className="text-xl font-semibold mb-3">Featured</h2>
      <ProductGrid products={products} />
    </Layout>
  )
}
