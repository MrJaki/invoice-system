const pool = require('./db');

/**
 * Getting all bill lines from bills id
 * @param {number} id 
 * @returns 
 */
module.exports.getAllBillLines = function(id) {
    const query = `SELECT * 
                   FROM vrstice_racuna
                   WHERE id_racuna = $1`;
    return pool.query(query, [id])
        .then(res => res.rows);
};

/**
 * Updating bill line data
 * @param {number} quantity 
 * @param {string} quantity_type 
 * @param {string} desc 
 * @param {number} price 
 * @param {number} id_bill_line 
 * @returns 
 */
module.exports.updateBillLine = function(quantity, quantity_type, desc, price, id_bill_line) {
    const query = `UPDATE vrstice_racuna
                   SET kolicina=$1, tip_kolicine=$2, opis=$3, cena=$4
                   WHERE id=$5
                   RETURNING *`;
    return pool.query(query, [quantity, quantity_type, desc, price, id_bill_line])
        .then(res => res.rows[0]);
};

/**
 * Adding new bill line
 * @param {number} quantity 
 * @param {string} quantity_type 
 * @param {string} desc 
 * @param {number} price 
 * @param {number} id_bill 
 * @returns 
 */
module.exports.addBillLine = function(quantity, quantity_type, desc, price, id_bill) {
    const query = `INSERT INTO vrstice_racuna (kolicina, tip_kolicine, opis, cena, id_racuna)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *`;
    return pool.query(query, [quantity, quantity_type, desc, price, id_bill])
        .then(res => res.rows[0]);
};

/**
 * Getting tarif value from komitent so we can calcuate final bill amount
 * @param {number} id_bill 
 * @returns 
 */
module.exports.getTaxTarifStatement = function(id_bill) {
    const query = `SELECT v.stopnja
                   FROM vrste_izjav v
                   JOIN komitenti k ON v.id = k.id_vrsta_izjave
                   JOIN racuni r ON k.id = r.id_komitenta
                   WHERE r.id = $1
                   LIMIT 1`;
    return pool.query(query, [id_bill])
        .then(res => res.rows[0]);
}