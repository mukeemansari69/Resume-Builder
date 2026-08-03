const express = require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  }));   
  
  


  
/* Require all the Routes here  */
const authRouter = require('./routes/auth.routes');



/* using all the Routes here  */

app.use('/api/auth', authRouter);



module.exports = app;