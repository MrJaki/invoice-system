const express = require('express');
const router = express.Router();
const dbClients = require('../model/dbClients');

// Getting all clients
// In query: limit, offset
router.get('/',  async (req, res) => {
    const { limit, offset } = req.query;

    const limitNum = parseInt(req.query.limit, 10);
    const offsetNum = parseInt(req.query.offset, 10);

    try {
        const clients = await dbClients.getAllClients(limitNum, offsetNum);
        res.json({success: true, data: clients});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});


router.post('/',  async (req, res) => {
    const { title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id } = req.body;

    try {
        const newClient = await dbClients.addClient(title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id);
        res.json({success: true, data: newClient});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

module.exports = router;