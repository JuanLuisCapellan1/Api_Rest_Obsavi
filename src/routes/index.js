const express = require('express')
const userRoutes = require('./user')
const categoryRoutes = require('./category')
const optionRoutes = require('./option')
const router = express.Router()
const surveyRoutes = require('./survey')
const suggestionRoutes = require('./suggestions')

router.get('/', (req, res) => res.json({message: 'Welcome Home!'}))
router.use(userRoutes)
router.use(categoryRoutes)
router.use(optionRoutes)
router.use(surveyRoutes)
router.use(suggestionRoutes)

module.exports = router
