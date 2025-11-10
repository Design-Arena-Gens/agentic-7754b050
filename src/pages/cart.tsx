import Layout from '@/components/Layout'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

export default function CartPage() {
  const { items, remove, changeQty, totalPrice } = useCartStore()
  return (
    <Layout title="Cart">
      <h1 className="text-xl font-semibold mb-4">Shopping Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty. <Link className="underline" href="/">Browse products</Link></p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(i => (
              <div key={i.productId} className="flex items-center gap-4 border rounded p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {i.image && <img src={i.image} alt={i.name} className="w-16 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-sm text-gray-500">${i.price.toFixed(2)}</div>
                </div>
                <input type="number" min={1} value={i.quantity} onChange={e=>changeQty(i.productId, Number(e.target.value||1))} className="w-20 border rounded px-2 py-1 bg-transparent" />
                <button onClick={()=>remove(i.productId)} className="text-red-600">Remove</button>
              </div>
            ))}
          </div>
          <div className="border rounded p-4 h-max">
            <div className="flex justify-between mb-2"><span>Subtotal</span><span className="font-semibold">${totalPrice.toFixed(2)}</span></div>
            <Link href="/checkout" className="block mt-4 bg-blue-600 text-white text-center py-2 rounded">Checkout</Link>
          </div>
        </div>
      )}
    </Layout>
  )
}
