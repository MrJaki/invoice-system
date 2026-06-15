const client = require('./db');

/**
 * Getting all bill data via using bills id
 * @param {number} id 
 * @returns 
 */
module.exports.checkBillByID = function(id) {
    const query = `SELECT * FROM racuni WHERE id = $1 LIMIT 1`
    return client.query(query, [id])
        .then(res => res.rows[0]);
}

/**
 * Retrieving all bills within a start and end date, limited by a limit and offset to prevent database overload
 * @param {number} limitNum 
 * @param {number} offsetNum 
 * @param {string} start 
 * @param {string} end 
 * @returns 
 */
module.exports.getAllBills = function(limitNum, offsetNum, start, end) {
    const query = `SELECT r.*, k.naziv AS naziv_komitenta 
                   FROM racuni r 
                   LEFT JOIN komitenti k ON k.id = r.id_komitenta 
                   WHERE r.datum_valute BETWEEN $3 AND $4
                   ORDER BY r.datum_valute DESC, r.id DESC
                   LIMIT $1 OFFSET $2`;
    return client.query(query, [limitNum, offsetNum, start, end])
        .then(res => res.rows);
};

/**
 * Getting all bill data with additional client titles
 * @param {number} id 
 * @returns 
 */
module.exports.getBillByID = function(id) {
    const query = `SELECT r.*, k.naziv AS naziv_komitenta, k.pravni_naziv AS pravni_naziv_komitenta, k.dodatni_naziv, k.ulica, k.mesto
                   FROM racuni r 
                   LEFT JOIN komitenti k ON k.id = r.id_komitenta 
                   WHERE r.id = $1
                   LIMIT 1`;
    return client.query(query, [id])
        .then(res => res.rows[0]);
};

/**
 * Retreiving following bill number
 * @param {string} year 
 * @returns 
 */
module.exports.getNextBillNum = async function (year) {
    const query = `SELECT
                       COALESCE(
                           MAX(
                              CAST(SPLIT_PART(stevilka_racuna, '-', 2) AS INTEGER)
                           ), 0
                       ) + 1 AS next_number
                    FROM racuni
                    WHERE SPLIT_PART(stevilka_racuna, '-', 1) = $1
                   `
    const res = await client.query(query, [String(year)]);

    return `${year}-${res.rows[0].next_number}`;
};

/**
 * Updating bill data
 * @param {string} dateOut 
 * @param {string} dateValue 
 * @param {string} datePayment 
 * @param {number} id 
 * @returns 
 */
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

/**
 * Updating total amount on bill
 * @param {number} amount 
 * @param {number} id 
 * @returns 
 */
module.exports.updateBillAmount = function(amount, id) {
    const query = `UPDATE racuni
                   SET znesek=$1
                   WHERE id=$2
                   RETURNING *`;
    return client.query(query, [amount, id])
        .then(res => res.rows[0]);
};

/**
 * Adding new bill
 * @param {number} id_client 
 * @param {string} dateOut 
 * @param {string} dateValue 
 * @param {string} datePayment 
 * @param {number} bill_num 
 * @returns 
 */
module.exports.newBill = function(id_client, dateOut, dateValue, datePayment, bill_num) {
    const date_out = (typeof dateOut === 'string' ? dateOut.trim() : dateOut) || null;
    const date_value = (typeof dateValue === 'string' ? dateValue.trim() : dateValue) || null;
    const date_payment = (typeof datePayment === 'string' ? datePayment.trim() : datePayment) || null;
    const query = `INSERT INTO racuni (id_komitenta, datum_izstavitve, datum_valute, datum_plačila, stevilka_racuna)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *`;
    return client.query(query, [id_client, date_out, date_value, date_payment, bill_num])
        .then(res => res.rows[0]);
}

/**
 * Adding new bill
 * @param {number} id_client 
 * @param {string} dateOut 
 * @param {string} dateValue 
 * @param {string} datePayment 
 * @param {number} bill_num 
 * @returns 
 */
module.exports.newBillWithId = function(id, id_client, dateOut, dateValue, datePayment, bill_num, amount) {
    const date_out = (typeof dateOut === 'string' ? dateOut.trim() : dateOut) || null;
    const date_value = (typeof dateValue === 'string' ? dateValue.trim() : dateValue) || null;
    const date_payment = (typeof datePayment === 'string' ? datePayment.trim() : datePayment) || null;
    const query = `INSERT INTO racuni (id, id_komitenta, datum_izstavitve, datum_valute, datum_plačila, stevilka_racuna, znesek)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING *`;
    return client.query(query, [id, id_client, date_out, date_value, date_payment, bill_num, amount])
        .then(res => res.rows[0]);
}

/**
 * Deleting bill
 * @param {number} id
 * @returns 
 */
module.exports.deleteBill = function(id) {
    const query = `DELETE FROM racuni WHERE id = $1`;
    return client.query(query, [id])
        .then(res => res.rows[0]);
}