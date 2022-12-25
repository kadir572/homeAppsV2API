import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from './../controllers/userController'
import express from 'express'

// CONFIGURATION
const router = express.Router()

router
  .route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser)

export default router
