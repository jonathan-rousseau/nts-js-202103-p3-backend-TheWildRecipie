const express = require('express');
require('dotenv').config();
const cors = require('cors');
const platsRouter = require('./routes/plat');
const dessertsRouter = require('./routes/dessert');
const register = require('./routes/register');
const login = require('./routes/login');
const users = require('./routes/users');
const profile = require('./routes/profile');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.static('public'));

app.use('/plat', platsRouter);
app.use('/dessert', dessertsRouter);
app.use('/inscription', register);
app.use('/log', login);
app.use('/users', users);
app.use('/profile', profile);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express server listening on ${PORT}`);
  }
});
