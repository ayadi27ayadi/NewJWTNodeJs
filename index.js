const dotenv= require("dotenv");
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth')
dotenv.config();
// Middlewares
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_DB_URI)
.then(()=> console.log('DB Connection successfull'))
.catch((error) => {
    console.log(error)
});

app.use('/api', authRouter)
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Backend Server is Running ${port}`)
})