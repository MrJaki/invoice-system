const client = require('./db');

/**
 * Get all statement types
 * @returns 
 */
module.exports.getAllStatementTypes = function() {
    const query = `SELECT * FROM vrste_izjav`
    return client.query(query)
        .then(res => res.rows);
}