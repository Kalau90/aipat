/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('examplevscomplexity', function(t) {
		t.increments('examplevscomplexity_id').unsigned().primary();
        t.string('example_id').notNull();
        t.string('complexity_id').notNull();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('examplevscomplexity');
};
