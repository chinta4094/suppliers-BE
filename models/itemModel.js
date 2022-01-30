const { Model } = require('objection')

class Item extends Model{
    static get tableName(){
        return 'item'
    }
}

module.exports = Item