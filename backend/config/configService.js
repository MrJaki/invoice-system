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

    if (!fs.existsSync(DATA_FILE)) {
        return null;
    }

    // Always load config file
    config = JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
    );


    // Server: override database from env if provided
    if (!app || !app.isReady || !app.isReady()) {

        config.database = {
            host: process.env.DB_HOST || config.database?.host,
            port: process.env.DB_PORT || config.database?.port,
            database: process.env.DB_NAME || config.database?.database,
            user: process.env.DB_USER || config.database?.user,
            password: process.env.DB_PASSWORD || config.database?.password
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