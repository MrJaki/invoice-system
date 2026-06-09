// Uvoz Cliet razred iz paketa 'pg'
const { Client } = require('pg');

// Definiranje novega objekta odjemalca client z nastavitvami povezave
const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Poiskus povezave na bazo pri čemer sporočimo če je poiskus uspešenali pa vrnemo napko če ni
client.connect()
    .then(() => console.log('Povezan nabazo praksa_db'))
    .catch(err => console.error('Napaka pri povezavi na bazo:', err));

// Izvoz objekta client da omogočimo uporabo te povezave v drugih dattekah
module.exports = client;