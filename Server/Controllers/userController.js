const ApiError = require('../error/ApiError');
const uuid = require('uuid')
const path = require('path');
const fileSys = require('fs');
const {User, Hobby} = require('../models/models')

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
                    if (user.img && fileSys.existsSync(path.resolve(__dirname, '..', user.img))) {
                        fileSys.unlinkSync(path.resolve(__dirname, '..', user.img))
                    }
                }
                await user.update({name, sex, age, post_adr, img: fileName})
                return res.json(user)

                // if (hobby) {
                //     //hobby = JSON.parse(hobby)
                //     hobby.forEach(i =>
                //         Hobby.findOne({where: {name: i.name}}).then(ho) => {
                //             if(ho) {
                //
                //             } else {
                //                 Hobby.create({name: i.name}).then(hn) => {
                //
                //                 }
                //             }
                //     })
                //}
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res, next) {
        const {id} = req.query
        if (!id) {
            return next(ApiError.badRequest('Не задан ID'))
        }
        res.json(id)
    }
}

module.exports = new UserController()