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

    try {
        const statements = await dbTax.newTaxStatement(tarif, code, type, level, longer_desc);
        res.json({success: true, data: statements});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

router.patch('/',  async (req, res) => {
    const { tarif, code, type, level, longer_desc, id } = req.body;

    try {
        const statements = await dbTax.updateStatement(tarif, code, type, level, longer_desc, id);
        res.json({success: true, data: statements});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

router.delete('/', async (req, res) => {
    const id = parseInt(req.query.id, 10);

    try {
        const deletedStatement = await dbTax.deleteTaxStatement(id);
        res.json({success: true, data: deletedStatement});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

module.exports = router;