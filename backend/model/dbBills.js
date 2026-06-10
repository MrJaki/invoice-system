const client = require('./db');

module.exports.getAllBills = function(limitNum, offsetNum, start, end) {
    const query = `SELECT r.*, k.naziv AS naziv_komitenta 
                   FROM racuni r 
                   LEFT JOIN komitenti k ON k.id = r.id_komitenta 
                   WHERE r.datum_valute BETWEEN $3 AND $4
                   ORDER BY r.datum_valute DESC
                   LIMIT $1 OFFSET $2`;
    return client.query(query, [limitNum, offsetNum, start, end])
        .then(res => res.rows);
};