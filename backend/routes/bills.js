const express = require('express');
const router = express.Router();
const dbBills = require('../model/dbBills');
const pdfModel = require('../model/pdfMaker');
const path = require('path');
const fs = require('fs');
const { format } = require('@fast-csv/format');
const { loadConfig } = require('../config/configService');

const PREF_FILE = path.join(
    __dirname,
    '..',
    'user_preferences.json'
);

// Getting all bills
// In query: limit, offset, start, end
router.get('/', async (req, res) => {
    const { limit, offset, start, end } = req.query;

    const limitNum = parseInt(req.query.limit, 10);
    const offsetNum = parseInt(req.query.offset, 10);

    try {
        const bills = await dbBills.getAllBills(limitNum, offsetNum, start, end);
        res.json({ success: true, data: bills });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});

// Getting all bills for selected years
// In query: year
router.get('/whole-year', async (req, res) => {
    const { year } = req.query;

    try {
        const bills = await dbBills.getWholeYearBills(year);
        res.json({ success: true, data: bills });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});

// Getting next bill number
// In query: date
router.get('/next-number', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({
            success: false,
            error: 'Manjka datum za izračun naslednje št. računa!'
        });
    }

    try {
        const nextBillNum = await dbBills.getNextBillNum(date);

        res.json({ success: true, data: nextBillNum });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});

// Getting specifc bill via ID
// In query: id
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: "NeveljavenID računa!"
        });
    }

    try {
        const bill = await dbBills.checkBillByID(id);
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!" });

        const selected = await dbBills.getBillByID(id);
        res.json({ success: true, data: selected });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});



// Adding new bill
// In body: id_client, dateOut, dateValue, datePayment, bill_num
router.post('/', async (req, res) => {
    const { id_client, dateOut, dateValue, datePayment, bill_num } = req.body;

    if (!id_client || !dateOut || !dateValue || !bill_num) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const newBill = await dbBills.newBill(id_client, dateOut, dateValue, datePayment, bill_num);
        res.json({ success: true, data: newBill });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});

// Adding new bill with id
// In body: id, id_client, dateOut, dateValue, datePayment, bill_num
router.post('/import', async (req, res) => {
    const { id, id_client, dateOut, dateValue, datePayment, bill_num, amount } = req.body;

    if (!id || !id_client || !dateOut || !dateValue || !bill_num) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const outDate = new Date(dateOut);

        const nextBillNum = await dbBills.getNextBillNum(
            outDate.getFullYear()
        );


        if (nextBillNum)
            await dbBills.newBillWithId(id, id_client, dateOut, dateValue, datePayment, nextBillNum, amount);
        else
            await dbBills.newBillWithId(id, id_client, dateOut, dateValue, datePayment, bill_num, amount);

        res.json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});

// Reseting ID counter
router.post('/repairIDSequence', async (req, res) => {
    try {
        const nextBillNum = await dbBills.resetIDSequence();

        res.json({ success: true, data: nextBillNum });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});

// Exporting data in csv format
// Cod source: https://coreui.io/answers/how-to-generate-csv-files-in-nodejs/
router.post('/csv', async (req, res) => {
    const { year } = req.body;
    try {
        const bill = await dbBills.getYearBills(year);

        const billFilename = `bills-${year}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${billFilename}"`
        );

        const billCsv = format({
            headers: true,
            delimiter: ';'
        });

        billCsv.pipe(res);

        bill.forEach(row => {
            row.datum_izstavitve = new Date(row.datum_izstavitve).toISOString().split('T')[0];
            row.datum_valute = new Date(row.datum_valute).toISOString().split('T')[0];
            row.datum_placila = row.datum_placila ? new Date(row.datum_placila).toISOString().split('T')[0] : '';
            billCsv.write(row);
        });

        billCsv.end();

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});

// Generating invoice pdf
router.post('/:id/pdf', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const billData = await dbBills.getAllBillData(id);

        if (!billData)
            return res.status(400).json({ success: false, error: 'Račun ne obstaja!' });

        const config = loadConfig();

        const user = config || {};

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="racun-${billData.stevilka_racuna}.pdf"`);

        const pdfStream = pdfModel.generatePdf(billData, user.company);
        pdfStream.pipe(res);
        pdfStream.end();

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});



// Updating selected bill
// In body: dateOut, dateValue, datePayment, id_bill
router.patch('/', async (req, res) => {
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
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!" });

        const updated = await dbBills.updateBill(dateOut, dateValue, datePayment, id_bill);
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});

// Updating total amount on bill
// In body: amount
router.patch('/amount', async (req, res) => {
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
        if (!bill) return res.status(404).json({ success: false, error: "Račun z izbranim ID-jem ni najden!" });

        const updated = await dbBills.updateBillAmount(amount, id_bill);
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
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
        const stevilo = await dbBills.deleteBill(id_bill);
        if (stevilo === 0) return res.status(404).json({ success: false, error: 'Račun ne obstaja' });
        res.json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
})

module.exports = router;