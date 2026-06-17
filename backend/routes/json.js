'use strict';

const express = require('express');
const router = express.Router();

const fs = require('fs');

router.get('/company', async (req, res) => {
    fs.readFile('user_preferences.json', (err, data) => {
        if (err) throw err;
        let user = JSON.parse(data);
        return res.json({ data: user.company });
    });
});

router.patch('/company-update', async (req, res) => {
    const { name, surname, title, legal_title, street, city, tax_num, iban, bank } = req.body;

    fs.readFile('user_preferences.json', (err, data) => {
        if (err) throw err;
        let user = JSON.parse(data);

        user.company.ime = name;
        user.company.priimek = surname;
        user.company.naziv = title;
        user.company.pravni_naziv = legal_title;
        user.company.ulica = street;
        user.company.mesto = city;
        user.company.davcna_st = tax_num;
        user.company.iban = iban;
        user.company.banka = bank;

        fs.writeFileSync('user_preferences.json', JSON.stringify(user, null, 2));
    });
});


module.exports = router;