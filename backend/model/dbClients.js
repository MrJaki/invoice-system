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
