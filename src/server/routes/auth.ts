import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { connectDb, isDbConnected } from '@/lib/db'
import { UserModel } from '@/models/User'
import { signJwt } from '@/lib/jwt'

const memoryUsers: any[] = [
  { _id: 'u1', name: 'Admin', email: 'admin@elite.com', passwordHash: bcrypt.hashSync('admin123', 10), isAdmin: true }
]

export const authRouter = Router()

authRouter.post('/signup', async (req, res) => {
  await connectDb()
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  if (isDbConnected()) {
    const existing = await UserModel.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already in use' })
    const user = await UserModel.create({ name, email, passwordHash: await bcrypt.hash(password, 10), isAdmin: false })
    const token = signJwt({ userId: String(user._id), email: user.email, isAdmin: user.isAdmin })
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`)
    return res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
  }
  const exists = memoryUsers.find(u => u.email === email)
  if (exists) return res.status(400).json({ error: 'Email already in use' })
  const newUser = { _id: `u${Date.now()}`, name, email, passwordHash: bcrypt.hashSync(password, 10), isAdmin: false }
  memoryUsers.push(newUser)
  const token = signJwt({ userId: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin })
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`)
  res.status(201).json({ user: { _id: newUser._id, name, email, isAdmin: false } })
})

authRouter.post('/login', async (req, res) => {
  await connectDb()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  if (isDbConnected()) {
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = signJwt({ userId: String(user._id), email: user.email, isAdmin: user.isAdmin })
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`)
    return res.json({ user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
  }
  const user = memoryUsers.find(u => u.email === email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = bcrypt.compareSync(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signJwt({ userId: user._id, email: user.email, isAdmin: user.isAdmin })
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`)
  res.json({ user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
})

authRouter.post('/logout', (_req, res) => {
  res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`)
  res.json({ ok: true })
})

authRouter.get('/me', async (req, res) => {
  // During MVP we read token in client to display
  res.json({ ok: true })
})
