const client = require('./db');

module.exports.checkBillByID = function(id) {
    const query = `SELECT * FROM racuni WHERE id = $1 LIMIT 1`
    return client.query(query, [id])
        .then(res => res.rows[0]);
}

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

module.exports.getBillByID = function(id) {
    const query = `SELECT r.*, k.naziv AS naziv_komitenta, k.pravni_naziv AS pravni_naziv_komitenta, k.dodatni_naziv, k.ulica, k.mesto
                   FROM racuni r 
                   LEFT JOIN komitenti k ON k.id = r.id_komitenta 
                   WHERE r.id = $1
                   LIMIT 1`;
    return client.query(query, [id])
        .then(res => res.rows[0]);
};

module.exports.updateBill = function(dateOut, dateValue, datePayment, id) {
    const date_out = (typeof dateOut === 'string' ? dateOut.trim() : dateOut) || null;
    const date_value = (typeof dateValue === 'string' ? dateValue.trim() : dateValue) || null;
    const date_payment = (typeof datePayment === 'string' ? datePayment.trim() : datePayment) || null;
    const query = `UPDATE racuni
                   SET datum_izstavitve=$1, datum_valute=$2, datum_plačila=$3
                   WHERE id=$4
                   RETURNING *`;
    return client.query(query, [date_out, date_value, date_payment, id])
        .then(res => res.rows[0]);
};

module.exports.updateBillAmount = function(amount, id) {
    const query = `UPDATE racuni
                   SET znesek=$1
                   WHERE id=$2
                   RETURNING *`;
    return client.query(query, [amount, id])
        .then(res => res.rows[0]);
};