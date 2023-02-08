// Rata Surithpinyo 6330454721
// ** I am using port 3000 **
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({path: './config/config.env' });

connectDB();

const app = express();
const hospitals = require('./routes/hospitals');
app.use('/api/v1/hospitals',hospitals);

const PORT = process.env.PORT || 3000 ;
app.listen(PORT,console.log('Server running in',process.env.NODE_ENV,'mode on port',PORT));

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});