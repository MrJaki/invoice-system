const express = require('express');
const router = express.Router();
const dbTax = require('../model/dbTax');

// Getting all statement types
router.get('/',  async (req, res) => {

    try {
        const statements = await dbTax.getAllStatementTypes();
        res.json({success: true, data: statements});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});


router.post('/',  async (req, res) => {
    const { tarif, code, type, level, longer_desc } = req.body;

    if (!tarif || !code || !level || !longer_desc) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const statements = await dbTax.newTaxStatement(tarif, code, type, level, longer_desc);
        res.json({success: true, data: statements});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

router.patch('/:id',  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID davka!'
        });
    }

    const { tarif, code, type, level, longer_desc } = req.body;

    if (!tarif || !code || !level || !longer_desc) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const statements = await dbTax.updateStatement(tarif, code, type, level, longer_desc, id);
        res.json({success: true, data: statements});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID davka!'
        });
    }

    try {
        const stevilo = await dbTax.deleteTaxStatement(id);
        if (stevilo === 0) return res.status(404).json({ success: false, error: 'Davek ne obstaja' });
        res.json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

module.exports = router;