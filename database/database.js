const Sequelize = require('sequelize')

const connection = new Sequelize('perguntas','root','1q2w3e',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection