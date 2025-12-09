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
router.get('/assignments' , admincontroller.assignments)
router.get('/itemassignments' , admincontroller.itemassignments)
router.get('/topiclist' , admincontroller.topiclist)
router.post('/createperiod' , admincontroller.createperiod)
router.post('/createassignment' , admincontroller.createassignment)
router.post('/createtopic' , admincontroller.createtopic)
router.post('/addindicator' , admincontroller.addindicator)


module.exports = router