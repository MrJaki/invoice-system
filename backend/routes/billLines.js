const express = require('express');
const router = express.Router();
const dbBillLines = require('../model/dbBillLines');

router.get('/',  async (req, res) => {
    const id = parseInt(req.query.id, 10);

    try {
        const bills = await dbBillLines.getAllBills(id);
        res.json({success: true, data: bills});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

router.patch('/',  async (req, res) => {
    const { kolicina, tip_kolicine, opis, cena, } = req.body;

    const id_bill_line = parseInt(req.body.id, 10);

    try {
        const bill = await dbBillLines.updateBillLine(kolicina, tip_kolicine, opis, cena, id_bill_line);
        res.json({success: true, data: bill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

module.exports = router;