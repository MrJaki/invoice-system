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

module.exports = router;