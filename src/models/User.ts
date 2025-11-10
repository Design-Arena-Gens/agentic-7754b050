import { Schema, model, models } from 'mongoose'

export interface UserDoc {
  _id: string
  name: string
  email: string
  passwordHash: string
  isAdmin: boolean
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<UserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true })

export const UserModel = models.User || model<UserDoc>('User', UserSchema)
