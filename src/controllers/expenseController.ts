import { Request, Response } from 'express'
import { Expense, IExpense } from '../models/Expense'
import { User } from '../models/User'
import mongoose from 'mongoose'
import errorMessages from '../constants/errorMessages'

// @desc Get all expenses
// @route GET /expense
// @access Private
export const getAllExpenses = async (req: Request, res: Response) => {
  const expenses: IExpense[] = await Expense.find().lean()

  if (!expenses.length)
    return res.status(400).json({ message: errorMessages.expense.notFound })

  const mappedExpenses = expenses.map(expense => {
    const { _id, debtors, ...rest } = expense
    const mappedDebtors = debtors.map(debtor => {
      const { _id: debtorId, ...debtorRest } = debtor
      return { ...debtorRest }
    })
    return { id: _id, debtors: mappedDebtors, ...rest }
  })

  res.json(mappedExpenses)
}

// @desc Create new expense
// @route POST /expense
// @access Private
export const createNewExpense = async (req: Request, res: Response) => {
  const { title, description, cost, payor, debtors } = req.body

  if (!title || !description || !cost || !payor || !debtors || !debtors?.length)
    return res.status(400).json({ message: 'All fields are required' })

  const payorObj = await User.findById(payor)

  if (!payorObj)
    return res.status(400).json({ message: 'Payor does not exist' })

  debtors.forEach((debtor: any) => {
    const debtorObj = User.findById(debtor._id)

    if (!debtorObj)
      return res.status(400).json({ message: 'Debtor does not exist' })
  })

  const expense = await Expense.create({
    title,
    description,
    cost,
    payor,
    debtors,
  })

  if (expense) {
    res.status(201).json({ message: 'Expense created' })
  } else {
    res.status(400).json({ message: 'Invalid expense data' })
  }
}

// @desc Update an expense
// @route PATCH /expense
// @access Private
export const updateExpense = async (req: Request, res: Response) => {
  const { id, title, description, cost, payor, debtors } = req.body

  if (!title || !description || !cost || !payor || !debtors)
    return res.status(400).json({ message: 'All fields are required' })

  const expense = await Expense.findById(id)

  if (!expense)
    return res.status(400).json({ message: 'Expense does not exist' })

  expense.title = title
  expense.description = description
  expense.cost = cost
  expense.payor = payor
  expense.debtors = debtors

  await expense.save()

  res.json({ message: 'Expense updated successfully' })
}

// @desc Delete an expense
// @route DELETE /expense
// @access Private
export const deleteExpense = async (req: Request, res: Response) => {
  const { id } = req.body

  const expense = await Expense.findById(id).exec()

  if (!expense)
    return res.status(400).json({ message: 'Expense does not exist' })

  if (expense.debtors.some(debtor => !debtor.paid)) {
    return res.status(400).json({ message: 'Expense has not been fully paid' })
  }

  await expense.delete()

  res.status(400).json({ message: 'Expense has been successfully deleted' })
}
