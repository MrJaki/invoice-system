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
    const { quantity, quantity_type, desc, price, } = req.body;

    const id_bill_line = parseInt(req.body.id, 10);

    try {
        const bill = await dbBillLines.updateBillLine(quantity, quantity_type, desc, price, id_bill_line);
        res.json({success: true, data: bill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

router.post('/',  async (req, res) => {
    const { quantity, quantity_type, desc, price } = req.body;

    const id_bill = parseInt(req.body.id_bill, 10);

    try {
        const bill = await dbBillLines.addBillLine(quantity, quantity_type, desc, price, id_bill);
        res.json({success: true, data: bill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

module.exports = router;