const { encode } = require("upnqr");
const QRCode = require("qrcode");
const express = require('express');
const router = express.Router();
const dbBills = require('../model/dbBills');
const fs = require("fs").promises;

// UPN QR Code data fields we need for filling qr code
const invoice = {

    clientTitle: "",
    clientAddress: "",
    clientCity: "",

    invoiceNumber: "",

    amount: 0,

    iban: "",

    referenceModel: "SI00",
    referenceValue: "",

    recipientName: "",
    recipientAddress: "",
    recipientCity: "",
};

// Inserting data in qr code
function createUpnQr(invoice) {

    const upnData = encode({
        polog: false,
        dvig: false,

        ime_placnika: invoice.clientTitle,
        ulica_placnika: invoice.clientAddress,
        kraj_placnika: invoice.clientCity,

        znesek: invoice.amount,

        nujno: false,

        koda_namena: "SCVE",

        namen_placila: "Račun",

        rok_placila: new Date(),

        IBAN_prejemnika: invoice.iban,

        referenca_prejemnika: `${invoice.referenceModel}${invoice.referenceValue}`,

        ime_prejemnika: invoice.recipientName,
        ulica_prejemnika: invoice.recipientAddress,
        kraj_prejemnika: invoice.recipientCity,

        rezerva: ""
    });


    return QRCode.toDataURL(upnData);
}

router.post('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID davka!'
        });
    }

    try {
        // Getting user data from json file
        const data = await fs.readFile('user_preferences.json', 'utf8');

        const user = JSON.parse(data);

        invoice.recipientName = user.company.pravni_naziv;
        invoice.recipientAddress = user.company.ulica;
        invoice.recipientCity = user.company.mesto;
        invoice.iban = user.company.iban;

        // Getting bill data from db
        const bill = await dbBills.getAllBillData(id);

        invoice.clientTitle = bill.naziv_komitenta;
        invoice.clientAddress = bill.ulica;
        invoice.clientCity = bill.mesto;

        invoice.amount = Number(bill.znesek);

        invoice.referenceValue = String(bill.stevilka_racuna.split('-')[0]) + String(bill.stevilka_racuna.split('-')[1]).padStart(4, "0");

        // Generating qr code
        const code = await createUpnQr(invoice);

        const img = code.replace(
            "data:image/png;base64,",
            ""
        );

        const buffer = Buffer.from(img, "base64");

        res.writeHead(200, {
            "Content-Type": "image/png"
        });

        res.end(buffer);

    } catch (err) {
        console.log(err);
        res.status(500).send("QR error");
    }
});

module.exports = router;