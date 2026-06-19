'use strict';

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(
    __dirname,
    '..',
    'user_preferences.json'
);

/**
 * Getting user data from json
 */
router.get('/company', requireAuth, async (req, res) => {

    try {

        const data = await fs.promises.readFile(
            DATA_FILE,
            'utf8'
        );

        const user = JSON.parse(data);

        return res.json({
            data: user.company
        });

    } catch (err) {

        return res.status(500).json({
            error: 'Napaka pri nalaganju podatkov uporabnika.'
        });
    }
});



/**
 * Updating usr data 
 * Only admins
 */
router.patch('/company-update', requireAuth, requireRole('admin'), async (req,res)=>{

    const { name, surname, title, legal_title, street, city, tax_num, iban, bank } = req.body;


    try {

        const data = await fs.promises.readFile(
            DATA_FILE,
            'utf8'
        );

        let user = JSON.parse(data);


        user.company = {
            ...user.company,

            ime: name,
            priimek: surname,
            naziv: title,
            pravni_naziv: legal_title,
            ulica: street,
            mesto: city,
            davcna_st: tax_num,
            iban,
            banka: bank
        };


        await fs.promises.writeFile(
            DATA_FILE,
            JSON.stringify(user,null,2)
        );


        return res.json({
            success:true
        });


    } catch(err){

        return res.status(500).json({
            error:"Posodabljanje neuspešno."
        });
    }
});



module.exports = router;