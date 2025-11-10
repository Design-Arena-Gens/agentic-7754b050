import { verifyJwt } from '@/lib/jwt'
import type { Request, Response, NextFunction } from 'express'

export type AuthedRequest = Request & { user?: { userId: string, email: string, isAdmin?: boolean } }

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const payload = verifyJwt(token)
  if (!payload) return res.status(401).json({ error: 'Unauthorized' })
  req.user = payload
  next()
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Forbidden' })
  next()
}
