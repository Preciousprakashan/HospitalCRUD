const express = require('express');
const app = new express();



const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.static('public'));


const basicRoutes = require('./routes/basicroutes');
app.use('/basic', basicRoutes);















app.listen(4000, () => {
    console.log('server running on PORT 4000');
});
