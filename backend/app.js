require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.FRONTED_URL,
  credentials: true
}));

app.use(express.json());

app.use('/api/bills', require('./routes/bills'));
app.use('/api/bill_lines', require('./routes/billLines'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/tax', require('./routes/tax'));
app.use('/api/json', require('./routes/json'));

app. listen(3002, () => console.log('Server running on port 3002'));