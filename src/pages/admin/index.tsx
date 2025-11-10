import Layout from '@/components/Layout'
import Link from 'next/link'

export default function AdminHome() {
  return (
    <Layout title="Admin">
      <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/products" className="border rounded p-4 hover:shadow">Manage Products</Link>
      </div>
    </Layout>
  )
}
