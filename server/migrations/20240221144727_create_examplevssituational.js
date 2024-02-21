/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('examplesvssituationals', function(t) {
		t.increments('examplesvssituationals_id').unsigned().primary();
        t.string('example_id').notNull();
        t.string('situational_id').notNull();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('examplesvssituationals');
};
