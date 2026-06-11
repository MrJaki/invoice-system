const client = require('./db');

module.exports.getAllBills = function(id) {
    const query = `SELECT * 
                   FROM vrstice_racuna
                   WHERE id_racuna = $1`;
    return client.query(query, [id])
        .then(res => res.rows);
};

module.exports.updateBillLine = function(quantity, quantity_type, desc, price, id_bill_line) {
    const query = `UPDATE vrstice_racuna
                   SET kolicina=$1, tip_kolicine=$2, opis=$3, cena=$4
                   WHERE id=$5
                   RETURNING *`;
    return client.query(query, [quantity, quantity_type, desc, price, id_bill_line])
        .then(res => res.rows[0]);
};

module.exports.addBillLine = function(quantity, quantity_type, desc, price, id_bill) {
    const query = `INSERT INTO vrstice_racuna (kolicina, tip_kolicine, opis, cena, id_racuna)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *`;
    return client.query(query, [quantity, quantity_type, desc, price, id_bill])
        .then(res => res.rows[0]);
};