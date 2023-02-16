// Rata Surithpinyo 6330454721
// ** I am using port 3000 **
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({path: './config/config.env' });

connectDB();
const app = express();
app.use(express.json());
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);

const PORT = process.env.PORT ;
//app.listen(PORT,console.log('Server running in',process.env.NODE_ENV,'mode on port',PORT));

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});