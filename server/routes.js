const router = require('express').Router()
const controllers = require('./controllers')

router.get('/user', controllers.user.get)
router.post('/user', controllers.user.post)

module.exports = router