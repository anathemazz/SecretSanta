const Router = require('express')
const router = new Router()
const userPairController = require('../Controllers/userPairController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware('ADMIN'), userPairController.create)
router.get('/', userPairController.getAll)

module.exports = router