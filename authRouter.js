const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {body} = require("express-validator");
const roleMiddleware = require('./middlewares/roleMiddleware')

router.post('/registration', [
    body('username', 'Имя пользователя не может быть пустым!')
        .notEmpty()
        .matches(/.*[a-zA-Z].*/),
    body('password', 'Пароль не может быть меньше 8 и больше 16 символов')
        .isLength({ min: 8, max: 16 })
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)

module.exports = router