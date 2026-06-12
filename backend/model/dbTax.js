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

module.exports.newTaxStatement = function(tarif, desc, type, level, longer_desc) {
    const query = `INSERT INTO vrste_izjav (tarifa, opis_davka, tip_davka, stopnja, opis)
                   VALUES ($1,$2, $3, $4, $5)
                   RETURNING *`
    return client.query(query, [tarif, desc, type, level, longer_desc])
        .then(res => res.rows[0]);
}