const router = require('express').Router()
const evaluatee_controllers = require('../controller/evaluatee')
const auth = require('../middlewares/auth')


router.get('/profile' , auth('evaluatee') ,  evaluatee_controllers.profile)


module.exports = router