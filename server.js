const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = express.Router();
const apiRoutes = require('./app/routes/api')(router);
const port = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); 
app.use(express.static(__dirname + '/public'));
app.use('/api', apiRoutes);

mongoose.connect('mongodb://localhost:27017/Wisebatt', err => {
    if (err) return console.log(`Not connected to db ${err}`);
    else return console.log('Successfully connected to db');
});

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});