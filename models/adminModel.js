const { Model } = require('objection')

class Admin extends Model{
    static get tableName(){
        return 'admin'
    }
}

module.exports = Admin