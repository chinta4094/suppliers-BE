const { Model } = require('objection')

class HUHU extends Model{
    static get tableName(){
        return 'huhu'
    }
}

module.exports = HUHU