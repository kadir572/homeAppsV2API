import mongoose, { Schema, Document } from 'mongoose'

export type Role = 'admin' | 'operator'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String as () => Role,
    enum: ['admin', 'operator'],
    default: 'operator',
  },
  active: {
    type: Boolean,
    default: true,
  },
})

export interface User extends Document {
  username: string
  password: string
  role: Role
  active: boolean
}

export const User = mongoose.model<User>('User', UserSchema)
