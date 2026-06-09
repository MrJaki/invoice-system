const client = require('./db');

module.exports.getAllBills = function() {
    const query = `SELECT r.*, k.naziv AS naziv_komitenta FROM racuni r LEFT JOIN komitenti k ON k.id = r.id_komitenta`;
    return client.query(query)
        .then(res => res.rows);
};