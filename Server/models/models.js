const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    name: {type: DataTypes.STRING, allowNull: false},
    sex: {type: DataTypes.STRING},
    age: {type: DataTypes.INTEGER},
    post_adr: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
})

const Hobby = sequelize.define('hobby', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const User_hob = sequelize.define('user_hob', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    hobbyId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
            model: Hobby,
            key: 'id'
        }
    }
})

const User_pair = sequelize.define('user_pair', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    santa_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    rec_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
})

User.belongsToMany(Hobby, {through: User_hob})
Hobby.belongsToMany(User, {through: User_hob})

User.hasOne(User_pair,{
    as: 'santa_pair',
    foreignKey: 'santa_id'
})

User.hasOne(User_pair,{
    as: 'rec_pair',
    foreignKey: 'rec_id'
})

User_pair.belongsTo(User,{
    as: 'santa_user',
    foreignKey: 'santa_id'
})

User_pair.belongsTo(User,{
    as: 'rec_user',
    foreignKey: 'rec_id'
})

User.hasMany(User_hob, {
    as: 'userHobby',
    foreignKey: 'userId',
})

User_hob.belongsTo(User, {
    as: 'user',
    foreignKey: 'userId',
})

Hobby.hasMany(User_hob, {
    as: 'HobbyUser',
    foreignKey: 'hobbyId',
})

User_hob.belongsTo(Hobby, {
    as: 'hobby',
    foreignKey: 'hobbyId',
})

module.exports = {
    User,
    User_pair,
    Hobby,
    User_hob
}