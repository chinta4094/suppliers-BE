const knex = require('knex')
const { Model } = require('objection')
const knexfile = require('../knexfile')

function connectDB(){
    const db = knex(knexfile.process.env.PRODUCTION || knexfile.development)
    Model.knex(db)
    console.log('DB connected!')
}

module.exports = connectDB