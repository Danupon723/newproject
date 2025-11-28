const router = require('express').Router()
const authcontroller = require('../controller/auth')

router.get('/dept' , authcontroller.department)
router.get('/grop' , authcontroller.group)
router.post('/login' , authcontroller.login)
router.post('/register' , authcontroller.register)

module.exports = router