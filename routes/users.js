const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const pool = require('../config/mysql');

const { JWT_AUTH_SECRET } = process.env;

const authenticateWithJsonWebToken = (req, res, next) => {
  if (req.headers.authorization !== undefined) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, JWT_AUTH_SECRET, (err) => {
      if (err) {
        res
          .status(401)
          .json({ errorMessage: "you're not allowed to access these data" });
      } else {
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ errorMessage: "you're not allowed to access these data" });
  }
};

router.get('/', authenticateWithJsonWebToken, (req, res) => {
  pool.query(`SELECT * FROM user`, (error, result) => {
    if (error) {
      res.status(500).json({ errorMessage: error.message });
    } else {
      res.status(200).json(
        result.map((user) => {
          return { ...user, password: 'hidden' };
        })
      );
    }
  });
});

router.delete('/:id', (request, response) => {
  const { id } = request.params;
  pool.query('DELETE FROM user WHERE id= ?', [id], (error, result) => {
    if (error) {
      response.status(500).send(error);
    } else if (result.affectedRows > 0) {
      response.status(200).send(result);
    } else {
      response.status(404).send({ message: 'utilisateur non existant' });
    }
  });
});

module.exports = router;
