const fs = require('fs');
const { getConfigPath } = require('./paths');
const { app } = require('electron');

const DATA_FILE = getConfigPath();

if (!fs.existsSync(DATA_FILE)) {

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
            {
                company: {},
                database: {}
            },
            null,
            2
        )
    );
}

function loadConfig() {
    // Electron mode
    if (app && app.isReady && app.isReady()) {

        const file = path.join(
            app.getPath("userData"),
            "user_preferences.json"
        );


        if (!fs.existsSync(file)) {
            return null;
        }


        return JSON.parse(
            fs.readFileSync(file, "utf8")
        );
    }



    // Browser/server mode
    return {
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    };
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