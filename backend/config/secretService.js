const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

let app;

try {
    app = require("electron").app;
} catch {
    app = null;
}


function getConfigFile(){
    if(app && app.isReady && app.isReady()){
        return path.join(
            app.getPath("userData"),
            "user_preferences.json"
        );
    }

    return path.join(
        __dirname,
        "..",
        "user_preferences.json"
    );
}

function generateSecret(){

    return crypto
        .randomBytes(64)
        .toString("hex");

}

// Loading secrets 
function loadSecrets(){
    // Browser / server mode
    if(!app || !app.isReady || !app.isReady()){

        return {
            JWT_SECRET: process.env.JWT_SECRET,
            APP_SECRET: process.env.APP_SECRET
        };
    }

    // Electron mode
    const file = getConfigFile();

    let config = JSON.parse(
        fs.readFileSync(file,"utf8")
    );

    let changed = false;

    if(!config.secrets){
        config.secrets = {};
        changed = true;
    }

    if(!config.secrets.JWT_SECRET){

        config.secrets.JWT_SECRET =
            generateSecret();

        changed = true;
    }

    if(!config.secrets.APP_SECRET){

        config.secrets.APP_SECRET =
            generateSecret();

        changed = true;
    }

    if(changed){

        fs.writeFileSync(
            file,
            JSON.stringify(
                config,
                null,
                2
            )
        );
    }

    return config.secrets;
}

module.exports = {
    loadSecrets
};