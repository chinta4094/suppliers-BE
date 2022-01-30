const knex = require('knex')
const { Model } = require('objection')
const knexfile = require('../knexfile')

function connectDB(){
    const db = knex(knexfile.development)
    Model.knex(db)
    console.log('DB connected!')
}

module.exports = connectDB