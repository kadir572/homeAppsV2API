import { Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs, { promises as fsPromises } from 'fs'
import path from 'path'

const logEvents = async (message: string, logFileName: string) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}`

  if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
    await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
  }
  await fsPromises.appendFile(
    path.join(__dirname, '..', 'logs', logFileName),
    logItem
  )
}

const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  console.log(`${req.method} ${req.path}`)
  next()
}

export { logEvents, logger }
