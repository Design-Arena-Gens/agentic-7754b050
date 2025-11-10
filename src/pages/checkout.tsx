import Layout from '@/components/Layout'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCartStore()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle'|'processing'|'done'|'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items.length, router])

  async function handlePay() {
    setStatus('processing')
    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')
      if (data.simulated) {
        clear()
        setStatus('done')
        setMessage('Payment simulated successfully. Order placed!')
      } else if (data.clientSecret) {
        // For simplicity, simulate success after intent creation in this MVP
        clear()
        setStatus('done')
        setMessage('Payment intent created. Order pending!')
      } else {
        throw new Error('Unexpected response')
      }
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message)
    }
  }

  return (
    <Layout title="Checkout">
      <h1 className="text-xl font-semibold mb-4">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-3">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="border rounded px-3 py-2 bg-transparent" />
              <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border rounded px-3 py-2 bg-transparent" />
            </div>
          </div>
        </div>
        <div className="border rounded p-4 h-max">
          <div className="flex justify-between mb-2"><span>Total</span><span className="font-semibold">${totalPrice.toFixed(2)}</span></div>
          <button disabled={status==='processing'} onClick={handlePay} className="mt-4 bg-blue-600 text-white w-full py-2 rounded">
            {status==='processing' ? 'Processing...' : 'Pay now'}
          </button>
          {message && <p className="mt-3 text-sm">{message}</p>}
        </div>
      </div>
    </Layout>
  )
}
