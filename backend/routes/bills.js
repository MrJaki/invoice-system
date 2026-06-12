const express = require('express');
const router = express.Router();
const dbBills = require('../model/dbBills');

// Getting all bills
// In query: limit, offset, start, end
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
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Getting specifc bill via ID
// In query: id
router.get('/selected_id',  async (req, res) => {
    const { id } = req.query;

    const id_bill = parseInt(req.query.id, 10);

    try {
        const bill = await dbBills.checkBillByID(id_bill);
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!"});

        const selected = await dbBills.getBillByID(id_bill);
        res.json({success: true, data: selected});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

// Getting next bill number
// In query: date
router.get('/get_next_bill_num',  async (req, res) => {
    const { date } = req.query;

    try {
        const nextBillNum = await dbBills.getNextBillNum(date);

        res.json({success: true, data: nextBillNum});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Updating selected bill
// In body: dateOut, dateValue, datePayment, id_bill
router.patch('/',  async (req, res) => {
    const { dateOut, dateValue, datePayment } = req.body;

    const id_bill = parseInt(req.body.id, 10);

    try {
        const bill = await dbBills.checkBillByID(id_bill);
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!"});

        const updated = await dbBills.updateBill(dateOut, dateValue, datePayment, id_bill);
        res.json({success: true, data: updated});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

// Updating total amount on bill
// In body: amount
router.patch('/update_amount',  async (req, res) => {
    const { amount } = req.body;

    const id_bill_line = parseInt(req.body.id, 10);

    try {
        const bill = await dbBills.checkBillByID(id_bill_line);
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!"});

        const updated = await dbBills.updateBillAmount(amount, id_bill_line);
        res.json({success: true, data: updated});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

// Adding new bill
// In body: id_client, dateOut, dateValue, datePayment, bill_num
router.post('/',  async (req, res) => {
    const { id_client, dateOut, dateValue, datePayment, bill_num } = req.body;

    try {
        const newBill = await dbBills.newBill(id_client, dateOut, dateValue, datePayment, bill_num);
        res.json({success: true, data: newBill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

router.delete('/', async (req, res) => {
    const id_bill = parseInt(req.query.id, 10);

    try {
        const deletedBill = await dbBills.deleteBill(id_bill);
        res.json({success: true, data: deletedBill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
})

module.exports = router;