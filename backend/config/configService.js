const fs = require('fs');
const path = require('path');
const { getConfigPath } = require('./paths');

let app = null;

try {
    ({ app } = require('electron'));
} catch {}

const DATA_FILE = getConfigPath();

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
            {
                company: {},
                database: null
            },
            null,
            2
        )
    );
}

function loadConfig() {

    let config = null;

    // Electron
    if (app && app.isReady && app.isReady()) {

        if (!fs.existsSync(DATA_FILE)) {
            return null;
        }

        config = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );

    } else {

        // Server
        config = {
            database: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD
            }
        };
    }


    // validate database
    if (
        !config.database ||
        !config.database.host ||
        !config.database.database ||
        !config.database.user
    ) {
        config.database = null;
    }


    return config;
}


function saveConfig(config) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(config, null, 2)
    );
}


module.exports = {
    loadConfig,
    saveConfig
};