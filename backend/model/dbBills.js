const pool = require('./db');

/**
 * Getting all bill data via using bills id
 * @param {number} id 
 * @returns 
 */
module.exports.checkBillByID = function(id) {
    const query = `SELECT * FROM racuni WHERE id = $1 LIMIT 1`
    return pool.query(query, [id])
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
                   WHERE r.datum_izstavitve BETWEEN $3 AND $4
                   ORDER BY r.datum_valute DESC, r.id DESC
                   LIMIT $1 OFFSET $2`;
    return pool.query(query, [limitNum, offsetNum, start, end])
        .then(res => res.rows);
};

/**
 * Retrieving all bills within a year grouped by months
 * @param {number} year
 * @returns
 */
module.exports.getWholeYearBills = function(year) {
    const query = `
        WITH months AS (
            SELECT generate_series(
                $1::date,
                $2::date - INTERVAL '1 month',
                INTERVAL '1 month'
            ) AS mesec
        )
        SELECT 
            TO_CHAR(m.mesec, 'YYYY-MM') AS mesec,
            COUNT(r.id) AS stevilo_racunov,
            COALESCE(SUM(r.znesek), 0) AS skupni_znesek,
            COALESCE(
                SUM(
                    CASE 
                        WHEN r.datum_placila IS NULL 
                        THEN r.znesek 
                        ELSE 0
                    END
                ), 
                0
            ) AS neplacano
        FROM months m
        LEFT JOIN racuni r
            ON r.datum_izstavitve >= m.mesec
           AND r.datum_izstavitve < m.mesec + INTERVAL '1 month'
        GROUP BY m.mesec
        ORDER BY m.mesec;
    `;

    const startDate = `${year}-01-01`;
    const endDate = `${Number(year) + 1}-01-01`;

    return pool.query(query, [startDate, endDate])
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
    return pool.query(query, [id])
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
    const res = await pool.query(query, [String(year)]);

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
                   SET datum_izstavitve=$1, datum_valute=$2, datum_placila=$3
                   WHERE id=$4
                   RETURNING *`;
    return pool.query(query, [date_out, date_value, date_payment, id])
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
    return pool.query(query, [amount, id])
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
    const query = `INSERT INTO racuni (id_komitenta, datum_izstavitve, datum_valute, datum_placila, stevilka_racuna)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *`;
    return pool.query(query, [id_client, date_out, date_value, date_payment, bill_num])
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
    const query = `INSERT INTO racuni (id, id_komitenta, datum_izstavitve, datum_valute, datum_placila, stevilka_racuna, znesek)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING *`;
    return pool.query(query, [id, id_client, date_out, date_value, date_payment, bill_num, amount])
        .then(res => res.rows[0]);
};

/**
 * Function that resets automatic ID counter after manually isnerting IDs
 * @returns 
 */
module.exports.resetIDSequence = async function() {
    const result = await pool.query(`
        SELECT setval(
            pg_get_serial_sequence('racuni', 'id'),
            COALESCE((SELECT MAX(id) FROM racuni), 1),
            true
        )
    `);

    return result.rows[0];
};

/**
 * Deleting bill
 * @param {number} id
 * @returns 
 */
module.exports.deleteBill = function(id) {
    const query = `DELETE FROM racuni WHERE id = $1`;
    return pool.query(query, [id])
        .then(res => res.rowCount);
}

/**
 * Getting every data that is conncted to bill id inclding clients, tax statements and bill lines
 * @param {number} id 
 * @returns 
 */
module.exports.getAllBillData = function(id) {
    const query = `SELECT
                        r.*,
                        k.naziv AS naziv_komitenta,
                        k.pravni_naziv AS pravni_naziv_komitenta,
                        k.ulica,
                        k.mesto,
                        k.davcna_st,
                        v_i.stopnja,
                        json_agg(
                            json_build_object(
                                'id', v_r.id,
                                'kolicina', v_r.kolicina,
                                'tip_kolicine', v_r.tip_kolicine,
                                'opis', v_r.opis,
                                'cena', v_r.cena
                            )
                        ) AS vrstice
                    FROM racuni r
                    LEFT JOIN komitenti k
                        ON k.id = r.id_komitenta
                    LEFT JOIN vrstice_racuna v_r
                        ON v_r.id_racuna = r.id
                    LEFT JOIN vrste_izjav v_i 
                        ON v_i.id = k.id_vrsta_izjave
                    WHERE r.id = $1
                    GROUP BY
                    r.id,
                    k.id,
                    v_i.id,
                    v_i.stopnja`;
    return pool.query(query, [id])
        .then(res => res.rows[0]);
};

/**
 * Getting all bills from year specified in attributes
 * @param {string} year 
 * @returns 
 */
module.exports.getYearBills = function(year) {
    const query = `
        SELECT * FROM racuni
        WHERE datum_izstavitve >= $1
          AND datum_izstavitve < $2
    `;

    const start = `${year}-01-01`;
    const end = `${Number(year) + 1}-01-01`;

    return pool.query(query, [start, end])
        .then(res => res.rows);
}

/**
 * Retrieves all bills linked to a specific tax type
 */
module.exports.getBillByTaxId = function(id) {
    const query = `
        SELECT r.* FROM racuni r
        JOIN komitenti k ON k.id = r.id_komitenta
        JOIN vrste_izjav v ON v.id = k.id_vrsta_izjave
        WHERE v.id = $1
    `;

    return pool.query(query, [id])
        .then(res => res.rows);
}

/**
 * Retrieves all bills linked to a specific client
 */
module.exports.getBillByClientId = function(id) {
    const query = `
        SELECT r.* FROM racuni r
        JOIN komitenti k ON k.id = r.id_komitenta
        WHERE k.id = $1
    `;

    return pool.query(query, [id])
        .then(res => res.rows);
}