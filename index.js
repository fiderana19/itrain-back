const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors');
require('dotenv').config();

//Using CORS
app.use(cors());
app.use(express.json());
//Requiring all files
const userRouter = require('./src/utilisateur/user');
const reservationRouter = require('./src/reservation');
const trainRouter = require('./src/train');
const villeRouter = require('./src/ville');
const trajetRouter = require('./src/trajet');
//Routing the endpoint
app.use('/user' , userRouter)
app.use('/reservation', reservationRouter);
app.use('/train', trainRouter);
app.use('/trajet', trajetRouter);
app.use('/ville', villeRouter);
//Listening to port
app.listen(port , () => {
    console.log(`The app listening on ${port}`);
})