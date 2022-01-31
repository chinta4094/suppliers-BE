const { Model } = require('objection')

class Token extends Model{
    static get tableName(){
        return 'token'
    }
}

module.exports = Token