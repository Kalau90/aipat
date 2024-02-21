/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('examples', function(t) {
		t.renameColumn("aicases_id", "example_id")
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('examples', function(t) {
		t.renameColumn("example_id", "aicases_id")
    });
};
