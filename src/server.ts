import 'express-async-errors'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import rootRouter from './routes/rootRoute'
import userRouter from './routes/userRoutes'
import expenseRouter from './routes/expenseRoutes'
import shoppingRouter from './routes/shoppingRoutes'
import errorRouter from './routes/errorRoute'
import corsOptions from './config/corsOptions'
import cookieParser from 'cookie-parser'
import connectDB from './config/dbConn'
import mongoose from 'mongoose'
import errorHandler from './middleware/errorHandler'
import { logger } from './middleware/logger'

// CONFIGURATION
dotenv.config()
const app = express()
mongoose.set('strictQuery', true)
connectDB()
const PORT = process.env.PORT || process.env.SERVER_PORT
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// ROUTES
app.use('/', rootRouter)
app.use('/user', userRouter)
app.use('/expense', expenseRouter)
app.use('/shopping', shoppingRouter)
app.all('*', errorRouter)

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
})
