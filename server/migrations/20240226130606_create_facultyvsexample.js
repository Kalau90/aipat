/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('examplevsfaculty', function(t) {
		t.increments('examplevsfaculty_id').unsigned().primary();
        t.string('example_id').notNull();
        t.string('faculty_id').notNull();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('examplevsfaculty');
};
