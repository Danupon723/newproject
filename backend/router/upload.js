const router = require('express').Router()
const upload = require('../middlewares/upload')
const auth = require('../middlewares/auth')
const controller_uploade_valuatee = require('../controller/evaluatee')

router.post("/evaluatee" , auth('evaluatee') , upload.single('photo') , controller_uploade_valuatee.uploadContract )

module.exports = router