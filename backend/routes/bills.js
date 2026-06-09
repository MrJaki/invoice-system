const express = require('express');
const router = express.Router();
const dbBills = require('../model/dbBills');

// GET /api/employees → seznam vseh zaposlenih (JSON)
router.get('/',  async (req, res) => {
    try {
        const bills = await dbBills.getAllBills();
        res.json({success: true, data: bills});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

module.exports = router;