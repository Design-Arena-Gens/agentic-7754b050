import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const itemsCount = useCartStore(s => s.totalQuantity)
  useEffect(() => setMounted(true), [])
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title ? `${title} | Elite Electronics` : 'Elite Electronics'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="border-b sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/40">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">Elite Electronics</Link>
          <nav className="flex items-center gap-4">
            <Link href="/category/phones" className="hover:underline">Phones</Link>
            <Link href="/category/laptops" className="hover:underline">Laptops</Link>
            <Link href="/category/accessories" className="hover:underline">Accessories</Link>
            <Link href="/category/gadgets" className="hover:underline">Gadgets</Link>
            <Link href="/cart" className="relative">
              <span>Cart</span>
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-3 text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5">{itemsCount}</span>
              )}
            </Link>
            <Link href="/account" className="hover:underline">Account</Link>
            {mounted && (
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded border px-2 py-1"
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-gray-500">? {new Date().getFullYear()} Elite Electronics</footer>
    </div>
  )
}
