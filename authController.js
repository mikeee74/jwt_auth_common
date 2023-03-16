const User = require('./model/User')
const Role = require('./model/Role')
const bcrypt = require('bcrypt');
const {validationResult} = require("express-validator");
const jwt = require('jsonwebtoken')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, process.env.SECRET, {expiresIn: "24h"})
}

class AuthController {
    async registration(req, res) {
        try {
            const { username, password } = req.body
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }

            const candidate = await User.findOne({username})

            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует!'})
            }
            const hash = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ value: "USER" })
            const user = new User({ username, password: hash, roles: [userRole.value] })
            await user.save()

            return res.json({ message: "Пользователь успешно зарегистрирован!" })
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error!'})
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({username})

            if (!user) {
                return res.status(400).json({message: `Пользователь с именем ${username} не найден!`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Неверный пароль!`})
            }

            const token = generateAccessToken(user._id, user.roles)

            return res.json({ token })
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error!'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            return res.json(users)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'getUsers error!'})
        }
    }
}

module.exports = new AuthController()