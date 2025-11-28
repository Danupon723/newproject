const router = require('express').Router()
const admincontroller = require('../controller/admin')
const auth = require('../middlewares/auth')

router.get('/userlist'  , admincontroller.userlist)
router.post('/createuser' , auth('admin')  , admincontroller.createuser)
router.put('/edituser/:id' ,  admincontroller.edituser)


module.exports = router