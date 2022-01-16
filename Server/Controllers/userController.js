const ApiError = require('../error/ApiError');
const uuid = require('uuid')
const path = require('path');
const fileSys = require('fs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Hobby, User_hob} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign({id, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async update(req, res, next) {
        try {
            const id = req.params.id
            let {name, sex, age, post_adr, fileName, hobby} = req.body

            const user = await User.findByPk(id)
            if (user) {
                if (!fileName || fileName !== user.img) {
                    if (req.files) {
                        const {img} = req.files
                        fileName = uuid.v4() + ".jpg"
                        await img.mv(path.resolve(__dirname, '..', 'static', fileName))
                    }
                    if (user.img && fileSys.existsSync(path.resolve(__dirname, '..', 'static', user.img))) {
                        fileSys.unlinkSync(path.resolve(__dirname, '..', 'static', user.img))
                    }
                }
                await user.update({name, sex, age, post_adr, img: fileName})

                if (hobby) {
                    await User_hob.destroy({where: {userId: id}})

                    for await (const i of hobby) {
                        try {
                            const hobbyOld = await Hobby.findOne({where: {name: i.name}})
                            if (hobbyOld) {
                                await User_hob.create({userId: id, hobbyId: hobbyOld.id})
                            } else {
                                const hobbyNew = await Hobby.create({name: i.name})
                                await User_hob.create({UserId: id, hobbyId: hobbyNew.id})
                            }
                        } catch (e) {
                            next(ApiError.badRequest(e.message))
                        }
                    }

                    /*let hid = [];
                    hobby.forEach(i =>
                        Hobby.findOne({where: {name: i.name}}).then((ho) => {
                            if (ho) {
                                hid.push(ho.id)
                                UserController.updateUserHobby(hid, hobby.length, id, next)
                            } else {
                                Hobby.create({name: i.name}).then((hn) => {
                                    hid.push(hn.id)
                                    UserController.updateUserHobby(hid, hobby.length, id, next)
                                }).catch((e) => {
                                    next(ApiError.badRequest(e.message))
                                })
                            }
                        }).catch((e) => {
                            next(ApiError.badRequest(e.message))
                        })
                    )*/

                    return await UserController.getUserDeep(id, res, next)
                } else {
                    return res.json(user)
                }
            } else {
                next(ApiError.badRequest(`Пользователь с id = ${id} не найден`))
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    /*static updateUserHobby(hid, len, user_id, next) {
        if (hid.length === len) {
            User_hob.destroy({where: {userId: user_id}}).then(() => {
                hid.forEach(i => {
                    User_hob.create({userId: user_id, hobbyId: i}).then(() => {
                    }).catch((e) => {
                        next(ApiError.badRequest(e.message))
                    })
                })
            }).catch((e) => {
                next(ApiError.badRequest((e.message)))
            })
        }
    }*/

    static async getUserDeep(id, res, next) {
        try {
            const user = await User.findByPk(id, {
                include: [{
                    model: User_hob,
                    as: 'user_hob',
                    required: false,
                    include: [{
                        model: Hobby,
                        as: 'hobby',
                        required: false
                    }]
                }]
            })
            if (user) {
                return res.json(user)
            } else {
                next(ApiError.badRequest(`Пользователь с id = ${id} не найден`))
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        const id = req.params.id
        return await UserController.getUserDeep(id, res, next)
    }

    /*async getOne(req, res, next) {
        try {
            const id = req.params.id
            const user = await User.findByPk(id, {
                include: [{
                    model: User_hob,
                    as: 'userHobby',
                    required: false,
                    include: [{
                        model: Hobby,
                        as: 'hobby',
                        required: false
                    }]
                }]
            })

            if (user) {
                return res.json(user)
            } else {
                next(ApiError.badRequest(`Пользователь с id = ${id} не найден`))
            }
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }*/
}

module.exports = new UserController()