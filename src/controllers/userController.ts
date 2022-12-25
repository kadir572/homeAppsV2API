import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/User'
import mongoose from 'mongoose'
import errorMesages from '../constants/errorMessages'

// @desc Get all users
// @route GET /user
// @access Private
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select('-password').lean()

  if (!users?.length) return res.status(400).json({ message: 'No users found' })

  const usersToSend = users.map(user => {
    return {
      id: user._id,
      username: user.username,
      role: user.role,
      active: user.active,
    }
  })

  res.json(usersToSend)
}

// @desc Create new user
// @route POST /user
// @access Private
export const createNewUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body

  // Confirming data
  if (!username || !password)
    return res.status(400).json({ message: errorMesages.allFieldsReq })

  // Check for duplicate
  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()

  if (duplicate)
    return res.status(409).json({ message: errorMesages.duplicateUsername })

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10)

  const userObject =
    role !== 'admin' && role !== 'operator'
      ? { username, password: hashedPwd }
      : { username, password: hashedPwd, role }

  // Create and store new user
  const user = await User.create(userObject)

  if (user) {
    res.status(201).json({ message: `New user ${username} created` })
    console.log(user)
  } else {
    res.status(400).json({ message: errorMesages.invalidUserData })
  }
}

// @desc Update a user
// @route PATCH /user
// @access Private
export const updateUser = async (req: Request, res: Response) => {
  const { id, username, role, active, password } = req.body

  // Confirm data
  if (!id || !username || !role || typeof active !== 'boolean') {
    return res.status(400).json({ message: errorMesages.allFieldsReq })
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: errorMesages.userNotFound })

  const user = await User.findById(id).exec()

  if (!user) return res.status(400).json({ message: errorMesages.userNotFound })

  // Check for duplicate
  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: errorMesages.duplicateUsername })
  }

  user.username = username
  user.role = role
  user.active = active

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} updated successfully` })
}

// @desc Delete a user
// @route DELETE /user
// @access Private
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.body

  if (!id) return res.status(400).json({ message: errorMesages.idRequired })

  const user = await User.findById(id).exec()

  if (!user) return res.status(400).json({ message: errorMesages.userNotFound })

  const result = await user.deleteOne()

  res.json({ message: `User ${result.username} with Id ${result.id} deleted` })
}
