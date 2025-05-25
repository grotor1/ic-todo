const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRouter = require('./routes/todoRouter.js');

const app = express();
const port = 5050;
const dbUrl = 'mongodb://root:root@localhost:27017';

app.use(cors());
app.use(express.json());

app.use('/todos', todoRouter);

const start = async () => {
    try {
        await mongoose.connect(dbUrl);
        app.listen(port, () => console.log(`Port: ${port}`));
    } catch (e) {
        console.log('Error', e);
        process.exit(1);
    }
};

start();


