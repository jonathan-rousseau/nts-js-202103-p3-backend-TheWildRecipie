const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const pool = require('../config/mysql');

const { JWT_AUTH_SECRET } = process.env;

router.post('/', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ errorMessage: 'Please specify both email and password' });
  } else {
    pool.query(`SELECT * FROM user WHERE email=?`, [email], (error, result) => {
      if (error) {
        res.status(500).json({ errorMessage: error.message });
      } else if (result.length === 0) {
        res.status(403).json({ errorMessage: 'Invalid Email' });
      } else if (bcrypt.compareSync(password, result[0].password)) {
        // password match
        const user = {
          id: result[0].id,
          email,
          role: result[0].role,
          password: 'hidden,',
        };
        const token = jwt.sign(
          { id: user.id, email: user.email, admin: user.role === 'ADMIN' },
          JWT_AUTH_SECRET,
          {
            expiresIn: 10000,
          }
        );
        res.status(200).json({ user, token });
      } else {
        // password don't match
        res.status(403).json({ errorMessage: 'invalid password' });
      }
    });
  }
});

module.exports = router;
