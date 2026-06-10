const client = require('./db');

module.exports.getAllBills = function(id) {
    const query = `SELECT * 
                   FROM vrstice_racuna
                   WHERE id_racuna = $1`;
    return client.query(query, [id])
        .then(res => res.rows);
};

module.exports.updateBillLine = function(kolicina, tip_kolicine, opis, cena, id) {
    const query = `UPDATE vrstice_racuna
                   SET kolicina=$1, tip_kolicine=$2, opis=$3, cena=$4
                   WHERE id=$5
                   RETURNING *`;
    return client.query(query, [kolicina, tip_kolicine, opis, cena, id])
        .then(res => res.rows[0]);
};