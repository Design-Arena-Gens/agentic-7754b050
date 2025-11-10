import Layout from '@/components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Signup failed')
    router.push('/account')
  }

  return (
    <Layout title="Sign Up">
      <form onSubmit={submit} className="max-w-md mx-auto border rounded p-6 space-y-3">
        <h1 className="text-xl font-semibold">Create account</h1>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border rounded px-3 py-2 bg-transparent" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2 bg-transparent" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded px-3 py-2 bg-transparent" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-blue-600 text-white rounded px-4 py-2 w-full">Sign up</button>
      </form>
    </Layout>
  )
}
