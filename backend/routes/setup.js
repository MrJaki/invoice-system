'use strict';

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

let DATA_FILE;

if (app && app.isReady && app.isReady()) {
    DATA_FILE = path.join(
        app.getPath("userData"),
        "user_preferences.json"
    );
} else {
    DATA_FILE = path.join(
        __dirname,
        '..',
        'user_preferences.json'
    );
}


if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify({
            company: {}
        }, null, 2)
    );
}

// Checking database status if able to connect or not
router.get("/status", async (req,res)=>{

    try {

        const { loadConfig } = require("../config/configService");

        const config = loadConfig();


        // no database configuration exists
        if(!config?.database){
            return res.json({
                connected:false,
                setupRequired:true
            });
        }


        const pool = require("../model/db");

        await pool.query("SELECT 1");


        res.json({
            connected:true,
            setupRequired:false
        });


    } catch(err){

        res.json({
            connected:false,
            setupRequired:false
        });

    }

});

// Updating database configuration in json file for electron apps
router.patch('/database-update', async (req, res) => {

    if(process.env.ELECTRON_MODE !== "true"){
        return res.status(403).json({
            error:"Not available"
        });
    }

    const {
        host,
        port,
        database,
        user,
        password
    } = req.body;

    try {
        const data = await fs.promises.readFile(
            DATA_FILE,
            'utf8'
        );

        let config = JSON.parse(data);

        config.database = {
            ...config.database,
            host,
            port,
            database,
            user,
            password
        };

        await fs.promises.writeFile(
            DATA_FILE,
            JSON.stringify(config, null, 2)
        );

        const pool = require("../model/db");


        await pool.restart();

        res.json({
            success: true
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Posodabljanje neuspešno."
        });
    }
});


module.exports = router;