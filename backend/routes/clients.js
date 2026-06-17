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

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID davka!'
        });
    }

    try {
        const clients = await dbClients.getClientById(id);
        res.json({success: true, data: clients});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Reseting ID counter
router.post('/repairIDSequence',  async (req, res) => {
    try {
        const Id = await dbClients.resetIDSequence();

        res.json({success: true, data: Id});
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

    if (!title) {
        return res.status(400).json({
            success: false,
            error: 'Manjka naziv!'
        });
    }

    try {
        const newClient = await dbClients.addClient(title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id);
        res.json({success: true, data: newClient});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Creating new client with preset id
// In body: title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id
router.post('/import',  async (req, res) => {
    const { id, title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id } = req.body;

    if (!id || !title) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const newClient = await dbClients.addClientWithId(id, title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id);
        res.json({success: true, data: newClient});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Updating client by id
// In body: title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id
// In params: id
router.patch('/:id',  async (req, res) => {
    const { title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id } = req.body;
    const id = parseInt(req.params.id, 10);

    if (!title || !id) {
        return res.status(400).json({
            success: false,
            error: 'Manjkajo obvezni podatki!'
        });
    }

    try {
        const newClient = await dbClients.updateClient(title, legal_title, additional_title, street, city, tax_num, obligee, statement_type_id, id);
        res.json({success: true, data: newClient});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

// Deleting client by id
// In query: id
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Neveljaven ID komitenta!'
        });
    }

    try {
        const stevilo = await dbClients.deleteClient(id);
        if (stevilo === 0) return res.status(404).json({ success: false, error: 'Komitent ne obstaja' });
        res.json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri branju iz baze!'});
    }
});

module.exports = router;