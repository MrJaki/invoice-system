const client = require('./db');

module.exports.checkClientByID = function(id) {
    const query = `SELECT * FROM komitenti WHERE id = $1 LIMIT 1`
    return client.query(query, [id])
        .then(res => res.rows[0]);
}

module.exports.getAllClients = function(limitNum, offsetNum) {
    const query = `SELECT * 
                   FROM komitenti
                   ORDER BY id
                   LIMIT $1 OFFSET $2`;
    return client.query(query, [limitNum, offsetNum])
        .then(res => res.rows);
};
