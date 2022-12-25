import express from 'express'
// import {} from '../controllers/shoppingController'

// CONFIGURATION
const router = express.Router()

router.route('/').get().post().patch().delete()

export default router
