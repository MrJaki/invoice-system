const express = require('express');
const router = express.Router();
const dbBills = require('../model/dbBills');

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

router.get('/selected_id',  async (req, res) => {
    const { id } = req.query;

    const id_bill = parseInt(req.query.id, 10);

    try {
        const bill = await dbBills.getBillByID(id_bill);
        res.json({success: true, data: bill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

router.patch('/',  async (req, res) => {
    const { dateOut, dateValue, datePayment } = req.body;

    const id_bill = parseInt(req.body.id, 10);

    try {
        const bill = await dbBills.updateBill(dateOut, dateValue, datePayment, id_bill);
        res.json({success: true, data: bill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

module.exports = router;