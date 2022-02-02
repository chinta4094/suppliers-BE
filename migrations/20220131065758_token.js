/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('token',(table) => {
        table.integer('id').notNullable()
        table.string('email').notNullable()
        table.string('secretToken').notNullable()
        table.timestamps(true,true)
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('token')
  };
  