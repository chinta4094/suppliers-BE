const knex = require('knex')
const { Model } = require('objection')
const knexfile = require('../knexfile')

const product = process.env.PRODUCTION
function connectDB(){
    const db = knex(knexfile)[product]
    Model.knex(db)
    console.log('DB connected!')
}

module.exports = connectDB