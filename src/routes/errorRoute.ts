import express from 'express'
import path from 'path'

// CONFIGURATION
const router = express.Router()

router.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
})

export default router
