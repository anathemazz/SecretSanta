const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const hobbyRouter = require('./hobbyRouter')
const userPairRouter = require('./userPairRouter')

router.use('/user', userRouter)
router.use('/hobby', hobbyRouter)
router.use('/userPair', userPairRouter)

module.exports = router