import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useCartStore } from '@/store/cartStore'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProductPage() {
  const { query } = useRouter()
  const id = String(query.id || '')
  const { data } = useSWR(id ? `/api/products/${id}` : null, fetcher)
  const product = data?.product
  const add = useCartStore(s => s.add)

  return (
    <Layout title={product?.name}>
      {!product ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {product.image && <img src={product.image} alt={product.name} className="object-cover w-full h-full" />}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-500">{product.brand}</p>
            <p className="mt-3 text-xl font-semibold">${product.price.toFixed(2)}</p>
            <p className="mt-4 text-sm leading-6 whitespace-pre-line">{product.description}</p>
            <button onClick={() => add({ product })} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
          </div>
        </div>
      )}
    </Layout>
  )
}
