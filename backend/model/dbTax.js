const pool = require('./db');

/**
 * Get all statement types
 * @returns 
 */
module.exports.getAllStatementTypes = function() {
    const query = `SELECT * FROM vrste_izjav ORDER BY id`
    return pool.query(query)
        .then(res => res.rows);
}

module.exports.getStatementById = function(id) {
    const query = `SELECT * FROM vrste_izjav WHERE id = $1 LIMIT 1`
    return pool.query(query, [id])
        .then(res => res.rows[0]);
}

/**
 * Adding new tax statement
 * @param {string} tarif 
 * @param {string} code 
 * @param {string} type 
 * @param {number} level 
 * @param {string} longer_desc 
 * @returns 
 */
module.exports.newTaxStatement = function(tarif, code, type, level, longer_desc) {
    const query = `INSERT INTO vrste_izjav (tarifa, sifra, tip_davka, stopnja, opis)
                   VALUES ($1,$2, $3, $4, $5)
                   RETURNING *`
    return pool.query(query, [tarif, code, type, level, longer_desc])
        .then(res => res.rows[0]);
}

/**
 * Updating tax statement
 * @param {string} tarif 
 * @param {string} code 
 * @param {string} type 
 * @param {number} level 
 * @param {string} longer_desc 
 * @param {number} id 
 * @returns 
 */
module.exports.updateStatement = function(tarif, code, type, level, longer_desc, id) {
    const query = `UPDATE vrste_izjav SET
                   tarifa=$1, sifra=$2, tip_davka=$3, stopnja=$4, opis=$5
                   WHERE id=$6
                   RETURNING *`
    return pool.query(query, [tarif, code, type, level, longer_desc, id])
        .then(res => res.rows[0]);
}

/**
 * Deleting tax statement
 * @param {number} id 
 * @returns 
 */
module.exports.deleteTaxStatement = function(id) {
    const query = `DELETE FROM vrste_izjav WHERE id = $1`;
    return pool.query(query, [id])
        .then(res => res.rowCount);
}