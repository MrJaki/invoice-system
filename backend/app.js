require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());


app.get('/api/tasks', (req, res) => {
  res.json([{ id: 1, title: 'Learn full-stack dev', completed: false }]);
});

app.use('/api/bills', require('./routes/bills'));

app. listen(3002, () => console.log('Server running on port 3002'));