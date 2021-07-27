const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const pool = require('../config/mysql');

router.post('/', (request, response) => {
  const { email, password, pseudo } = request.body;
  if (!email || !password || !pseudo) {
    response.status(403).send('email, pseudo or password missing');
  } else {
    bcrypt.hash(password, 10, function (err, hash) {
      // Store hash
      if (err) {
        response.status(500).send(err);
      }
      pool.query(
        'INSERT INTO user (email, password,pseudo) VALUE (?,?,?)',
        [email, hash, pseudo],
        (error, results) => {
          if (error) {
            response.status(500).send(error);
            console.log(error);
          } else {
            response.status(201).send({
              id: results.insertId,
              ...request.body,
              password: 'hidden',
            });
          }
        }
      );
    });
  }
});

module.exports = router;
