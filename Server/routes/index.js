const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const hobbyRouter = require('./hobbyRouter')

router.use('/user', userRouter)
router.use('/hobby', hobbyRouter)

module.exports = router