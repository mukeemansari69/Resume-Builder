const express = require('express');

const cookieParser = require('cookie-parser');



const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());

/* Require all the Routes here  */
const authRouter = require('./routes/auth.routes');



/* using all the Routes here  */

app.use('/api/auth', authRouter);



module.exports = app;