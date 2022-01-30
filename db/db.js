const knex = require('knex')
const { Model } = require('objection')
const knexfile = require('../knexfile')

const product = process.env.DB_ENVIRONMENT || 'development'
const connectDB = () =>{
    const db = knexfile[product]
    Model.knex(db)
    console.log('DB connected!')
}

module.exports = connectDB