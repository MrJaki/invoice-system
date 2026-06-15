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

// Getting client by id
// In params: id
router.get('/:id',  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const clients = await dbClients.getClientById(id);
        res.json({success: true, data: clients});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Creating new client
// In body: title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id
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

// Creating new client with preset id
// In body: title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id
router.post('/id',  async (req, res) => {
    const { id, title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id } = req.body;

    try {
        const newClient = await dbClients.addClientWithId(id, title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id);
        res.json({success: true, data: newClient});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

// Updating client by id
// In body: title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id
// In params: id
router.patch('/:id',  async (req, res) => {
    const { title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id } = req.body;
    const id = parseInt(req.params.id, 10);

    try {
        const newClient = await dbClients.updateClient(title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id, id);
        res.json({success: true, data: newClient});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

// Deleting client by id
// In query: id
router.delete('/', async (req, res) => {
    const id = parseInt(req.query.id, 10);

    try {
        const deletedClient = await dbClients.deleteClient(id);
        res.json({success: true, data: deletedClient});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze'});
    }
});

module.exports = router;