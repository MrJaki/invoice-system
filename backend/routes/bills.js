const express = require('express');
const router = express.Router();
const dbBills = require('../model/dbBills');

// GET /api/employees → seznam vseh zaposlenih (JSON)
router.get('/',  async (req, res) => {
    const { limit, offset, start, end } = req.query;

    const limitNum = parseInt(req.query.limit, 10);
    const offsetNum = parseInt(req.query.offset, 10);

    try {
        const bills = await dbBills.getAllBills(limitNum, offsetNum, start, end);
        res.json({success: true, data: bills});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

module.exports = router;