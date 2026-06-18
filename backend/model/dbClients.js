const pool = require('./db');

/**
 * Getting all client data by using id
 * @param {number} id 
 * @returns 
 */
module.exports.checkClientByID = function(id) {
    const query = `SELECT * FROM komitenti WHERE id = $1 LIMIT 1`
    return pool.query(query, [id])
        .then(res => res.rows[0]);
}

/**
 * Rtreiving all clients and limiting rows by using limit and offset so that we don't overload database
 * @param {number} limitNum 
 * @param {number} offsetNum 
 * @returns 
 */
module.exports.getAllClients = function(limitNum, offsetNum) {
    let query = `
        SELECT *
        FROM komitenti
        ORDER BY id
    `;

    const params = [];

    if (limitNum != null) {
        params.push(limitNum);
        query += ` LIMIT $${params.length}`;
    }

    if (offsetNum != null) {
        params.push(offsetNum);
        query += ` OFFSET $${params.length}`;
    }

    return pool.query(query, params)
        .then(res => res.rows);
};

/**
 * Getting client data by id
 * @param {number} id 
 * @returns 
 */
module.exports.getClientById = function(id) {
    const query = `SELECT * 
                   FROM komitenti
                   WHERE id = $1`;
    return pool.query(query, [id])
        .then(res => res.rows[0]);
};

/**
 * Adding new client
 * @param {string} title 
 * @param {string} legal_title 
 * @param {string} additional_title 
 * @param {string} street 
 * @param {string} city 
 * @param {string} tax_num 
 * @param {boolean} obligee 
 * @param {number} statement_type_id 
 * @returns 
 */
module.exports.addClient = function(title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id) {
    const query = `INSERT INTO komitenti (naziv, pravni_naziv, dodatni_naziv, ulica, mesto, davcna_st, zavezanec, id_vrsta_izjave)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                   RETURNING *`;
    return pool.query(query, [title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id])
        .then(res => res.rows[0]);
};

/**
 * Adding new client
 * @param {string} title 
 * @param {string} legal_title 
 * @param {string} additional_title 
 * @param {string} street 
 * @param {string} city 
 * @param {string} tax_num 
 * @param {boolean} obligee 
 * @param {number} statement_type_id 
 * @returns 
 */
module.exports.addClientWithId = function(id, title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id) {
    const query = `INSERT INTO komitenti (id, naziv, pravni_naziv, dodatni_naziv, ulica, mesto, davcna_st, zavezanec, id_vrsta_izjave)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                   RETURNING *`;
    return pool.query(query, [id, title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id])
        .then(res => res.rows[0]);
};

/**
 * Function that resets automatic ID counter after manually isnerting IDs
 * @returns 
 */
module.exports.resetIDSequence = async function() {
    const result = await pool.query(`
        SELECT setval(
            pg_get_serial_sequence('komitenti', 'id'),
            COALESCE((SELECT MAX(id) FROM komitenti), 1),
            true
        )
    `);

    return result.rows[0];
};

/**
 * Updating client
 * @param {string} title 
 * @param {string} legal_title 
 * @param {string} additional_title 
 * @param {string} street 
 * @param {string} city 
 * @param {string} tax_num 
 * @param {boolean} obligee 
 * @param {number} statement_type_id 
 * @param {number} id 
 * @returns 
 */
module.exports.updateClient = function(title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id, id) {
    const query = `UPDATE komitenti 
                   SET naziv=$1, pravni_naziv=$2, dodatni_naziv=$3, ulica=$4, mesto=$5, davcna_st=$6, zavezanec=$7, id_vrsta_izjave=$8
                   WHERE id=$9
                   RETURNING *`;
    return pool.query(query, [title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id, id])
        .then(res => res.rows[0]);
};

/**
 * Deleting client
 * @param {number} id 
 * @returns 
 */
module.exports.deleteClient = function(id) {
    const query = `DELETE FROM komitenti WHERE id = $1`;
    return pool.query(query, [id])
        .then(res => res.rowCount);
}