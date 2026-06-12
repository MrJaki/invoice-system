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

module.exports.updateStatement = function(tarif, desc, type, level, longer_desc, id) {
    const query = `UPDATE vrste_izjav SET
                   tarifa=$1, opis_davka=$2, tip_davka=$3, stopnja=$4, opis=$5
                   WHERE id=$6
                   RETURNING *`
    return client.query(query, [tarif, desc, type, level, longer_desc, id])
        .then(res => res.rows[0]);
}

module.exports.deleteTaxStatement = function(id) {
    const query = `DELETE FROM vrste_izjav WHERE id = $1`;
    return client.query(query, [id])
        .then(res => res.rows[0]);
}