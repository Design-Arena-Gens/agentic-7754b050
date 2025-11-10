import ProductCard from './ProductCard'
import { Product } from '@/models/Product'

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(p => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}
