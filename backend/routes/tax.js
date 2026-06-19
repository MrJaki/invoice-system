const express = require('express');
const router = express.Router();
const dbTax = require('../model/dbTax');
const { format } = require('@fast-csv/format');
const dbBills = require('../model/dbBills');
const dbBillLines = require('../model/dbBillLines');

// Getting all statement types
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



// Adding new tax statement
router.post('/',  async (req, res) => {
    const { tarif, code, type, level, longer_desc } = req.body;

    if (!tarif || !code || !level) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki! Prosim preverite ali so vsi zahtevani podatki vpisani v dbf datoteki.'
        });
    }

    try {
        const statements = await dbTax.newTaxStatement(tarif, code, type, level, longer_desc);
        res.json({success: true, data: statements});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Export data in csv format
router.post('/csv', async (req, res) => {
    try {
        const data = await dbTax.getAllStatementTypes();

        const filename = `tax.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${filename}"`
        );

        const csvStream = format({
            headers: true,
            delimiter: ';'
        });

        csvStream.pipe(res);

        data.forEach(row => {
            csvStream.write(row);
        });

        csvStream.end();

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!' });
    }
});



// Updating tax statament
router.patch('/:id',  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID davka!'
        });
    }

    const { tarif, code, type, level, longer_desc } = req.body;

    if (!tarif || !code || !level || !longer_desc) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const statements = await dbTax.updateStatement(tarif, code, type, level, longer_desc, id);

        const bills = await dbBills.getBillByTaxId(id);

        // Correcting all total amounts on bills 
        for (const z of bills) {
            const billLines = await dbBillLines.getAllBillLinesById(z.id);

            let currentAmount = 0;

            billLines.forEach(i => {
                currentAmount += (i.cena * i.kolicina);
            });

            const lineVat = currentAmount * (level / 100);
            const lineGross = currentAmount + lineVat;

            await dbBills.updateBillAmount(Number(lineGross), z.id);
        }

        res.json({success: true, data: statements});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});



// Deleting tax statement
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID davka!'
        });
    }

    try {
        const stevilo = await dbTax.deleteTaxStatement(id);
        if (stevilo === 0) return res.status(404).json({ success: false, error: 'Davek ne obstaja' });
        res.json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

module.exports = router;