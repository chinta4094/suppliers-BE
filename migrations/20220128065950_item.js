/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
  return knex.schema
  .createTable('item',(table) => {
      table.increments('id');
      table.string('itemName').notNullable();
      table.integer('itemCost').notNullable();
      table.string('image');
      table.timestamps(true,true)
  })  
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
return knex.schema.dropTableIfExists('item')
};
