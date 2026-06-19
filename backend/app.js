require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requireAuth = require('./middleware/requireAuth');
const requireRole = require('./middleware/requireRole');

const app = express();

app.use(cors({
  origin: process.env.FRONTED_URL
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.use('/api/bills', requireAuth, require('./routes/bills'));
app.use('/api/bill_lines', requireAuth, require('./routes/billLines'));
app.use('/api/clients', requireAuth, require('./routes/clients'));
app.use('/api/tax', requireAuth, require('./routes/tax'));
app.use('/api/json', requireAuth, require('./routes/json'));
app.use('/api/qr', requireAuth, require('./routes/qr'));

app. listen(3002, () => console.log('Server running on port 3002'));