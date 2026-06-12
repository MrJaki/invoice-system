const express = require('express');
const router = express.Router();
const dbTax = require('../model/dbTax');


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

module.exports = router;