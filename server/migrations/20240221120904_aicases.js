/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('aicases', function(t) {
		t.increments('aicases_id').unsigned().primary();
        t.string('recid').notNull();
        t.string('title').notNull();
        t.text('description', 'longtext').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('aicases');
};
