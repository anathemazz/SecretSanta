const ApiError = require('../error/ApiError');
const uuid = require('uuid')
const path = require('path');
const fileSys = require('fs');
const {User, Hobby, User_hob} = require('../models/models')

class UserController {
    async registration(req, res, next) {
        try {
            let {email, password, name, sex, age, post_adr} = req.body
            let fileName = ''
            if (req.files) {
                const {img} = req.files
                let fileNAme = uuid.v4() + ".jpg"
                await img.mv(path.resolve(__dirname, '..', 'static', fileNAme))
            }

            const user = await User.create({email, password, name, sex, age, post_adr, img: fileName})

            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async login(req, res) {

    }

    async check(req, res, next) {
        const {id} = req.query
        if (!id) {
            return next(ApiError.badRequest('Не задан ID'))
        }
        res.json(id)
    }

    async update(req, res, next) {
        try {
            const id = req.params.id
            let {name, sex, age, post_adr, fileName, hobby} = req.body

            const user = await User.findByPk(id)
            if (user){
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
                    let hid = [];
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
                    )
                }
            } else {
                next(ApiError.badRequest(`Пользователь с id = ${id} не найден`))
            }
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    static updateUserHobby(hid, len, user_id, next) {
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
    }

    async getOne(req, res, next) {
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
    }
}

module.exports = new UserController()