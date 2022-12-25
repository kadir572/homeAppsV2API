import {
  getAllExpenses,
  createNewExpense,
  deleteExpense,
  updateExpense,
} from './../controllers/expenseController'
import express from 'express'
// import {} from '../controllers/expenseController'

// CONFIGURATION
const router = express.Router()

router
  .route('/')
  .get(getAllExpenses)
  .post(createNewExpense)
  .patch(updateExpense)
  .delete(deleteExpense)

export default router
