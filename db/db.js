const knex = require('knex')
const { Model } = require('objection')
const knexfile = require('../knexfile')

const product = 'production' || 'development'
const connectDB = () =>{
    const db = knex(knexfile[product])
    Model.knex(db)
    console.log('DB connected!')
}

module.exports = connectDB