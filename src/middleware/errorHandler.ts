import { Request, Response, NextFunction } from 'express'
import { logEvents } from './logger'

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  )

  console.log(err.stack)

  const status = res.statusCode ? res.statusCode : 500

  res.status(status)

  res.json({ message: err.message, isError: true }) // isError is used for RTK Query, because all errors give a 200 and isError is the defining factor whether the response is an error
}

export default errorHandler
