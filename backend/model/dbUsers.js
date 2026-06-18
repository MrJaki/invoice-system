const client = require('./db');

/**
 * Getting user by email
 * @param {string} email 
 * @returns 
 */
module.exports.getByEmail = function(email) {
    const query = `SELECT * FROM uporabniki WHERE email = $1 LIMIT 1`;
    return client.query(query, [email])
        .then(r => r.rows[0]);
};

/**
 * Getting user by id and returning everthing except hash_password
 * @param {number} id 
 * @returns 
 */
module.exports.getById = function(id) {
    const query = 'SELECT id, email, ime, priimek, vloga, aktiven, created_at FROM uporabniki WHERE id = $1';
    return client.query(query, [id])
        .then(r => r.rows[0]);
};

/**
 * Addng new user
 * @param {string} email 
 * @param {string} passwordHash 
 * @param {string} name 
 * @param {string} surname 
 * @param {string} role 
 * @returns 
 */
module.exports.create = function(email, passwordHash, name, surname, role = 'uporabnik') {
    const query = `INSERT INTO uporabniki (email, password_hash, ime, priimek, vloga)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id, email, ime, priimek, vloga, created_at`;
    return client.query(query, [email, passwordHash, name, surname, role])
        .then(r => r.rows[0]);
};