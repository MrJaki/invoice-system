const { Pool } = require("pg");
const { loadConfig } = require("../config/configService");

let pool;

// Creating DB connection
function createPool() {

    const config = loadConfig();

    if (!config?.database) {
        return null;
    }


    const dbConfig = config.database;


    return new Pool({
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user,
        password: dbConfig.password
    });

    console.log('Database running!');
}


// Create initial pool
pool = createPool();


// Export wrapper object
const db = {

    query(...args) {
        if (!pool) {
            throw new Error("Database not configured");
        }

        return pool.query(...args);
    },


    connect(...args) {
        if (!pool) {
            throw new Error("Database not configured");
        }

        return pool.connect(...args);
    },


    async restart() {

        if (pool) {
            await pool.end();
        }

        pool = createPool();

        console.log("Database pool restarted");
    }

};


module.exports = db;