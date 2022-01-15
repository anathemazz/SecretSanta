const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/', userController.registration)
router.post('/login', userController.login)
router.put('/:id', userController.update)
router.get('/auth', userController.check)
router.get('/:id', userController.getOne)

module.exports = router