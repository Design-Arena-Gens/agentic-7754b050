import Layout from '@/components/Layout'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AccountPage() {
  const { data } = useSWR('/api/orders/mine', fetcher)
  const [orders, setOrders] = useState<any[]>([])
  useEffect(() => { if (data?.orders) setOrders(data.orders) }, [data])

  return (
    <Layout title="Account">
      <h1 className="text-xl font-semibold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o._id} className="border rounded p-4">
              <div className="flex justify-between"><span>Order</span><span className="font-mono">{o._id}</span></div>
              <div>Status: <span className="font-medium">{o.status}</span></div>
              <div>Total: <span className="font-medium">${o.total.toFixed(2)}</span></div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
