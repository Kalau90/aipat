/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('faculty', function(t) {
		t.increments('faculty_id').unsigned().primary();
        t.string('recid').notNull();
        t.string('title').notNull();
        t.text('notes', 'longtext').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('faculty');
};
