const { Client } = require('pg');

// Defining a new client object with connection settings
const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Attempt to connect to the database, reporting if the attempt was successful or returning a message if it was not.
client.connect()
    .then(() => console.log('Povezan nabazo praksa_db'))
    .catch(err => console.error('Napaka pri povezavi na bazo:', err));

// Export the client object to enable the use of this link in other files
module.exports = client;