const express = require('express');
const router = express.Router();
const dbBillLines = require('../model/dbBillLines');

// Getting all bill lines
router.get('/',  async (req, res) => {
    const id = parseInt(req.query.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID računa!'
        });
    }

    try {
        const bills = await dbBillLines.getAllBillLines(id);
        res.json({success: true, data: bills});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Getting tarif for calculating final amount
// In query: id_bill
router.get('/tax',  async (req, res) => {
    const id_bill = parseInt(req.query.id_bill, 10);

    if (Number.isNaN(id_bill)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID računa!'
        });
    }

    try {
        const tarif = await dbBillLines.getTaxTarifStatement(id_bill);
        res.json({success: true, data: tarif});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Updating bill lines
// In body: quantity, quantity_type, desc, price, id_bill_line
router.patch('/:id',  async (req, res) => {
    const { quantity, quantity_type, desc, price } = req.body;

    const id_bill_line = parseInt(req.params.id, 10);

    if (Number.isNaN(id_bill_line)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID vrstice rauna!'
        });
    }


    try {
        const bill = await dbBillLines.updateBillLine(quantity, quantity_type, desc, price, id_bill_line);
        res.json({success: true, data: bill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

// Adding new bill line to selected bill
// In body: quantity, quantity_type, desc, price, id_bill
router.post('/',  async (req, res) => {
    const { quantity, quantity_type, desc, price } = req.body;

    const id_bill = parseInt(req.body.id_bill, 10);

    try {
        const bill = await dbBillLines.addBillLine(quantity, quantity_type, desc, price, id_bill);
        res.json({success: true, data: bill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

module.exports = router;