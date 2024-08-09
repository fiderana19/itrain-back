const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors');
//Using CORS
app.use(cors());
app.use(express.json());
//Requiring all files
const userRouter = require('./src/utilisateur/user');
const reservationRouter = require('./src/reservation');
const trainRouter = require('./src/train');
const trajetRouter = require('./src/trajet');
//Routing the endpoint
app.use('/user' , userRouter)
app.use('/reservation', reservationRouter);
app.use('/train', trainRouter);
app.use('/trajet', trajetRouter);
//Listening to port
app.listen(port , () => {
    console.log(`The app listening on ${port}`);
})