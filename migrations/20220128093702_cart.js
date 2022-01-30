/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('cart',(table) => {
      table.increments('id');
      table.string('email').notNullable()
      table.string('itemName').notNullable()
      table.integer('itemCost').notNullable()
      table.integer('quantity').notNullable()
      table.integer('total').notNullable()
      table.timestamps(true,true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cart')
};
