const {User_pair} = require('../models/models')
const ApiError = require('../error/ApiError')

class UserPairController {
    async create(req, res) {
        const {santa_id, rec_id} = req.body
        const pair = await User_pair.create({santa_id, rec_id})
        return res.json(pair)
    }

    async getAll(req, res) {
        let {santa_id, rec_id, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let pairs;
        if (!santa_id && !rec_id) {
            pairs = await User_pair.findAndCountAll({limit, offset})
        }
        if (!santa_id && rec_id) {
            pairs = await User_pair.findAndCountAll({where: {santa_id}, limit, offset})
        }
        if (santa_id && !rec_id) {
            pairs = await User_pair.findAndCountAll({where: {rec_id}, limit, offset})
        }
        if (santa_id && rec_id) {
            pairs = await User_pair.findAndCountAll({where: {santa_id, rec_id}, limit, offset})
        }
        return res.json(pairs)
    }
}

module.exports = new UserPairController()