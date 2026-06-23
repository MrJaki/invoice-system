'use strict';

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

const fs = require("fs");
const path = require("path");
const { app } = require("electron");

function getDataFile(){

    // Electron mode
    if (
        app &&
        app.isReady &&
        app.isReady()
    ) {

        const userData = app.getPath("userData");

        if (!fs.existsSync(userData)) {
            fs.mkdirSync(userData, {
                recursive:true
            });
        }

        return path.join(
            userData,
            "user_preferences.json"
        );
    }


    // Browser / Node mode
    return path.join(
        __dirname,
        "..",
        "user_preferences.json"
    );
}

// Checking database status if able to connect or not
router.get("/status", async (req, res) => {
    const result = {
        connected: false,
        setupRequired: false,
        database: null,
        error: null
    };

    try {
        if (!app) return;

        const { loadConfig } = require("../config/configService");

        const config = loadConfig();

        if (!config?.database) {
            return res.json({
                ...result,
                setupRequired: true,
                error: "Database configuration missing"
            });
        }

        result.database = {
            host: config.database.host,
            database: config.database.database,
            user: config.database.user
        };

        const pool = require("../model/db");

        await pool.query("SELECT 1");

        return res.json({
            ...result,
            connected: true
        });

    } catch (err) {
        console.error("STATUS CHECK FAILED:", err);

        return res.json({
            ...result,
            setupRequired: true,
            error: err.message
        });
    }
});

// Updating database configuration in json file for electron apps
router.patch('/database-update', async (req, res) => {

    // if(process.env.ELECTRON_MODE !== "true"){
    //     return res.status(403).json({
    //         error:"Not available"
    //     });
    // }

    const {
        host,
        port,
        database,
        user,
        password
    } = req.body;

    try {
        const data = await fs.promises.readFile(getDataFile(), 'utf8');

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
            getDataFile(),
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