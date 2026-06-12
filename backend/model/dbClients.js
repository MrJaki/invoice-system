const client = require('./db');

/**
 * Getting all client data by using id
 * @param {number} id 
 * @returns 
 */
module.exports.checkClientByID = function(id) {
    const query = `SELECT * FROM komitenti WHERE id = $1 LIMIT 1`
    return client.query(query, [id])
        .then(res => res.rows[0]);
}

/**
 * Rtreiving all clients and limiting rows by using limit and offset so that we don't overload database
 * @param {number} limitNum 
 * @param {number} offsetNum 
 * @returns 
 */
module.exports.getAllClients = function(limitNum, offsetNum) {
    const query = `SELECT * 
                   FROM komitenti
                   ORDER BY id
                   LIMIT $1 OFFSET $2`;
    return client.query(query, [limitNum, offsetNum])
        .then(res => res.rows);
};

module.exports.addClient = function(title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id) {
    const query = `INSERT INTO komitenti (naziv, pravni_naziv, dodatni_naziv, ulica, mesto, davcna_st, zavezanec, id_vrsta_izjave)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                   RETURNING *`;
    return client.query(query, [title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id])
        .then(res => res.rows);
};
