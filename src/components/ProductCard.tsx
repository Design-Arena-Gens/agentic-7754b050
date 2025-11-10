import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/models/Product'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product._id}`} className="group border rounded-lg overflow-hidden hover:shadow">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative">
        {product.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium group-hover:underline">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
