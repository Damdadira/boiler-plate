const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose
    .connect('mongodb+srv://damdadi:1234@cluster0.e0xujcy.mongodb.net/')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('hi'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
