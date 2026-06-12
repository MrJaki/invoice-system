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
    const { tarif, desc, type, level, longer_desc } = req.body;

    try {
        const statements = await dbTax.newTaxStatement(tarif, desc, type, level, longer_desc);
        res.json({success: true, data: statements});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

module.exports = router;