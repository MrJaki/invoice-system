const express = require('express');
const router = express.Router();
const dbBills = require('../model/dbBills');

// Getting all bills
// In query: limit, offset, start, end
router.get('/',  async (req, res) => {
    const { limit, offset, start, end } = req.query;

    const limitNum = parseInt(req.query.limit, 10);
    const offsetNum = parseInt(req.query.offset, 10);

    if (!limitNum || !offsetNum) {
        return res.status(400).json({
            success: false,
            error: 'Manjkata limit in offset!'
        });
    }

    try {
        const bills = await dbBills.getAllBills(limitNum, offsetNum, start, end);
        res.json({success: true, data: bills});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Getting next bill number
// In query: date
router.get('/next-number',  async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({
            success: false,
            error: 'Manjka datum za izračun naslednje št. računa!'
        });
    }

    try {
        const nextBillNum = await dbBills.getNextBillNum(date);

        res.json({success: true, data: nextBillNum});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Reseting ID counter
router.get('/repairIDSequence',  async (req, res) => {
    try {
        const nextBillNum = await dbBills.resetIDSequence();

        res.json({success: true, data: nextBillNum});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Getting specifc bill via ID
// In query: id
router.get('/:id',  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: "NeveljavenID računa!"
        });
    }

    try {
        const bill = await dbBills.checkBillByID(id);
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!"});

        const selected = await dbBills.getBillByID(id);
        res.json({success: true, data: selected});
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

    if (!dateOut || !dateValue) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const bill = await dbBills.checkBillByID(id_bill);
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!"});

        const updated = await dbBills.updateBill(dateOut, dateValue, datePayment, id_bill);
        res.json({success: true, data: updated});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Updating total amount on bill
// In body: amount
router.patch('/amount',  async (req, res) => {
    const { amount } = req.body;

    const id_bill = parseInt(req.body.id, 10);

    if (!amount) {
        return res.status(400).json({
            success: false,
            error: 'Manjka znesek!'
        });
    }

    try {
        const bill = await dbBills.checkBillByID(id_bill);
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!"});

        const updated = await dbBills.updateBillAmount(amount, id_bill);
        res.json({success: true, data: updated});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Adding new bill
// In body: id_client, dateOut, dateValue, datePayment, bill_num
router.post('/',  async (req, res) => {
    const { id_client, dateOut, dateValue, datePayment, bill_num } = req.body;

    if (!id_client || !dateOut || !dateValue || !bill_num) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const newBill = await dbBills.newBill(id_client, dateOut, dateValue, datePayment, bill_num);
        res.json({success: true, data: newBill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Adding new bill with id
// In body: id, id_client, dateOut, dateValue, datePayment, bill_num
router.post('/import',  async (req, res) => {
    const {id, id_client, dateOut, dateValue, datePayment, bill_num, amount } = req.body;

    if (!id || !id_client || !dateOut || !dateValue || !bill_num) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const newBill = await dbBills.newBillWithId(id, id_client, dateOut, dateValue, datePayment, bill_num, amount);
        res.json({success: true, data: newBill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Deleting bill
// In query: id
router.delete('/:id', async (req, res) => {
    const id_bill = parseInt(req.params.id, 10);

    if (Number.isNaN(id_bill)) {
        return res.status(400).json({
            success: false,
            error: "NeveljavenID računa!"
        });
    }

    try {
        const deletedBill = await dbBills.deleteBill(id_bill);
        res.json({success: true, data: deletedBill});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
})

module.exports = router;