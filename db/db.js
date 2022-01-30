const knex = require('knex')
const { Model } = require('objection')
const knexfile = require('../knexfile')

const production = process.env.PRODUCTION
function connectDB(){
    const db = knex(knexfile.production || knexfile.development)
    Model.knex(db)
    console.log('DB connected!')
}

module.exports = connectDB