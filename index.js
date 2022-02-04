if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

// config
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (request, response) => {
  response.json({ message: 'Server running!' });
});

// database
mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@nodecluster.xp0on.mongodb.net/NodeCluster?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(3000);
    console.log('mongoDB logged');
  })
  .catch((error) => console.log(error));
