import mongoose, { Schema, Document } from 'mongoose'

const ExpenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    payor: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    debtors: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        moneyOwed: {
          type: Number,
          required: true,
        },
        paid: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export interface IExpense extends Document {
  title: string
  description: string
  cost: number
  payor: mongoose.Types.ObjectId
  debtors: {
    user: mongoose.Types.ObjectId
    moneyOwed: number
    paid: boolean
    _id?: mongoose.Types.ObjectId
  }[]
}

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema)
