const router = require('express').Router()
const admincontroller = require('../controller/admin')
const auth = require('../middlewares/auth')

router.get('/userlist'  , admincontroller.userlist)
router.post('/createuser'   , admincontroller.createuser)
router.put('/edituser/:id' ,  admincontroller.edituser)
router.get('/dept' , admincontroller.department)
router.get('/grop' , admincontroller.group)
router.get('/indicatorslist' , admincontroller.indicatorslist)
router.get('/periodslist' , admincontroller.periodslist)
router.post('/createperiod' , admincontroller.createperiod)


module.exports = router